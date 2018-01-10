/**
 * Created by bear on 2017/04/13.
 */
"use strict";
const request = require('request');
const stream_1 = require('stream');

exports.upload = function(contents){
    const method = `post`;
    const shrinkUrl = `https://tinypng.com/web/shrink`;
    const headers = {
        'User-Agent': `QQBrowser`
    };

    const body = contents;

    return new Promise(function(resolve, reject) {
        request({ url: shrinkUrl, method, headers, body }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            
            if (!body) {
                throw new Error(`response data should not be empty: ${body}`);
            }
            
            if (response.statusCode === 404) {
                throw new Error('tinypng官网屏蔽掉这个接口了！');
            }
            
            const result = JSON.parse(body);
            
            if (typeof result !== `object`) {
                throw new Error(`unknown response data type: ${result}`);
            }
            
            if (!result) {
                throw new Error(`response data is empty: ${result}`);
            }
            
            if (result.error) {
                reject(result);
                return;
            }

            if(result.output && result.output.url) {
                resolve(result.output.url)
            }
        });
    });
}

var downloadPic = function(uri, filename, complete){
    request.head(uri, function(err, res, body){
        request({url: uri, strictSSL: false})
            .pipe(fs.createWriteStream(TEMP_DIR + filename))
            .on('close', function() {
                complete();
            });
    });
};

exports.download = function(url){
    return new Promise((resolve, reject) => {
        const transform = new stream_1.Transform();
        request({ url, strictSSL: false })
            .on('data', function (chunk) {
            transform.push(chunk);
        })
            .on('end', function () {
            const buffer = transform.read();
            resolve(buffer);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
}