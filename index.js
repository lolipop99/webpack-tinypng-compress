'use strict';
var colors = require('colors');
var path = require('path');
var _ = require('lodash');
var readDir = require('./src/compression.js').readDir;
var readFile = require('./src/compression.js').readFile;
var compressImg = require('./src/compression.js').compressImg;
var emitImg = require('./src/compression.js').emitImg;

function TinyPNGPlugin(options) {
    this.options = _.assign({
        key: '',
        relativePath: './',
        ext: ['png', 'jpeg', 'jpg']
    }, options);

    // 非必须
    // if (!this.options.key) {
    //     throw new Error('need tinyPNG key');
    // }

    if (_.isString(this.options.key)) {
        this.options.key = [this.options.key];
    }

    //正则表达式筛选图片
    this.reg = new RegExp("\.(" + this.options.ext.join('|') + ')$', 'i');
}

TinyPNGPlugin.prototype.apply = function(compiler) {
    console.log(compiler.options.output.path)
    var _self = this,
        targetImgDir = this.getImgDir(compiler.options.output.path);

    compiler.plugin('after-emit', function(compilation, callback) {
        // console.log(colors.blue('处理图片ing.........'))
        // console.log(compilation)
        _self.upload(targetImgDir, compilation, callback);
    });
};

// 获取图片路径
TinyPNGPlugin.prototype.getImgDir = function(outputPath) {
    var imgUrls = [];
    var _self = this;

    if (_.isString(this.options.relativePath)) {
        imgUrls.push(path.resolve(outputPath, this.options.relativePath));
    } else if (_.isArray(this.options.relativePath)) {
        _.forEach(this.options.relativePath, function(relativePath) {
            imgUrls.push(path.resolve(outputPath, relativePath));
        });
    }

    _.forEach(imgUrls, function(imgDir){
        readDir(imgDir).then(function(files) {
            _.forEach(files, function(file) {
                if (!_self.reg.test(file)) {
                    _.pull(imgUrls, file);
                    imgUrls.push(path.resolve(imgUrls[0], file));
                }
            })
        })
    })

    return imgUrls;
}

/**
 * 上传到tinyPNG 官网上面进行文件压缩处理
 * @param  {Array}   targetImgDir 存储图片的绝对路径
 * @param  {Object}   compilation  [description]
 * @param  {Function} callback     [description]
 * @return {[type]}                [description]
 */
TinyPNGPlugin.prototype.upload = function(targetImgDir, compilation, callback) {
    var imgCount = 0,
        allCount = 0,
        _self = this;

    console.log('\n'); //换行

    _.forEach(targetImgDir, function(imgDir) {
        readDir(imgDir).then(function(files) {
            console.log(colors.blue('------------ compress img start ------------'));
            console.log('一共需压缩 ' + files.length + ' 张图片');
            // console.log(files)
            var promiseList = [];
            _.forEach(files, function(file) {
                if (_self.reg.test(file)) {
                    // console.log('成功')
                    allCount++;
                    imgCount++;

                    promiseList.push(_self.compress(path.join(imgDir, file), function() {
                        imgCount--;
                        console.log(colors.green('tinyPNG-webpack-plugin:[ ' + file + ' ],compress process is ' + (allCount - imgCount) + '/' + allCount));
                    }).catch(function(e) {
                        //AccountError 用户认证失败
                        const result = '当前账号本月流量已用完！';

                        if(e.status !== 429) result = e.message;

                        imgCount--;
                        console.log(colors.red('tinyPNG-webpack-plugin:[ ' + file + ' ], compress error:' + result));
                        // compilation.errors.push(e);
                    }));

                }else{
                    console.log(colors.red(colors.red('tinyPNG-webpack-plugin: 非图片文件 => ' + file)));
                }
            });

            return Promise.all(promiseList).then(() => {
                console.log(colors.blue('------------ compress img end ------------'));
                console.log('\n');
            });

        }).then(function() {
            if (imgCount <= 0) {
                callback();
            }
        }).catch(function(e) {
            callback()
            // compilation.errors.push(e);
            throw e;
        })
    });
};

TinyPNGPlugin.prototype.compress = function(imgDir, cb) {
    // console.log('压缩图片：' + imgDir)
    var _self = this;
    return readFile(imgDir).then(function(ImgFileInfo) {
        // console.log('图片信息：' + ImgFileInfo)
        return compressImg(_self.options.key, ImgFileInfo);
    }).then(function(compressImgInfo) {
        return emitImg(compressImgInfo);
    }).then(function() {
        cb();
    });
};

module.exports = TinyPNGPlugin;
