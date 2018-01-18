/**
 * Created by bear on 18/01/15.
 */
// 定义环境
declare var require: any;
declare var process: any;

const axios = require('axios');
const webpackSources = require('webpack-sources');
const colors  = require('colors');


class TinyPNGPlugin {
    apply(compiler) {
        let _this = this;
        
        // 执行编译
        compiler.plugin('emit', function(compilation, callback) {
            let imgs = [];
            
            for(var filename in compilation.assets){
                if (filename.match(/\.(png|jpg|jpeg|gif)/g))
                    imgs.push(filename);
            }
            
            if (!imgs.length)
                return callback();
                
            if (process.env.NODE_ENV !== 'production') 
                return console.log(colors.green('默认【process.env.NODE_ENV = production】，才开启图片压缩功能！'));
                
            console.log('\n' + colors.blue('------------ compress img start ------------') + '\n');
            
            Promise.all( imgs.map( filename => {
                        return _this.tinyCompress(compilation.assets, filename)
                    }) ).then( () => {
                        console.log('\n' + colors.blue('------------ compress img end ------------') + '\n');
                        callback();
                    });
        });
    }
    
    // 上传压缩、下载覆盖
    async tinyCompress(assets, filename) {
        try {
            const img = assets[filename].source();
        
            const url = await this.uploadPic(img);
            const data = await this.downloadPic(url);
            
            assets[filename] = new webpackSources.RawSource(data);
            
            console.log(colors.green(filename,' => success'));
            
            return Promise.resolve();
        } catch(e) {
            console.log(colors.red(filename, ' => fail:' + e));
            
            return Promise.resolve();
        }
    }
    
    uploadPic(data) {
        const headers = {
            "Referer" : "https://tinypng.com/",
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0",
            "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding" : "gzip, deflate",
            "Accept-Language" : "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
            "Cache-Control" : "no-cache",
            "Pragma" : "no-cache",
            "Connection"  : "keep-alive",
            "Host" : "tinypng.com"
        };
        const method = `post`;
        const url = `https://tinypng.com/web/shrink`;
        
        const body = data;

        return new Promise(function(resolve, reject) {
            axios({
                headers: headers,
                url: url,
                method: 'post',
                data: data
            }).then(res => {
                resolve(res.data.output.url)
            }, err => {
                reject(err);
            });
        });
    }
    
    downloadPic(url) {
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                timeout: 10000,
                method: 'get',
                responseType: 'arraybuffer'
            }).then( res => {
                resolve(res.data)
            }, err => {
                reject(err);
            });
        });
    }
}

export = TinyPNGPlugin;