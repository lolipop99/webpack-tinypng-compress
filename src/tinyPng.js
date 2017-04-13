"use strict";
/**
 * Created by allen on 2016/11/3.
 */
const request = require('request');
const stream_1 = require('stream');

exports.upload = function(contents){
    const method = `post`;
    const shrinkUrl = `https://tinypng.com/site/shrink`;
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
                throw new Error(`index.ts: response data should not be empty: ${body}`);
            }
            const result = JSON.parse(body);
            if (typeof result !== `object`) {
                throw new Error(`index.ts: unknown response data type: ${result}`);
            }
            if (!result) {
                throw new Error(`index.ts: response data is empty: ${result}`);
            }
            if (result.error) {
                reject(result);
                return;
            }
            // console.log(result.output.url)
            // console.log(resolve({
            //     url: result.output.url
            // }))
            // return resolve({
            //     url: result.output.url
            // });

            if(result.output && result.output.url) {
                resolve(result.output.url)
                // downloadPic(result.output.url, filename, function() {
                //     fs.readFile(TEMP_DIR + filename, function(err, data){
                //         if (err) {
                //             gutil.log(PLUGIN_NAME + '[error]: ', err);
                //         }
                //         callback(data);
                //     });
                // });
            }
            // resolve(JSON.parse(body));
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
var downloadsss = function(url){
    // console.log(url)
    return new Promise(function(resolve, reject) {
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
// class TinyPng {
//     upload(contents) {
//         const method = `post`;
//         const shrinkUrl = `https://tinypng.com/site/shrink`;
//         const headers = {
//             'User-Agent': `QQBrowser`
//         };
//         const body = contents;
//         console.log(contents)
//         return new Promise((resolve, reject) => {
//             request({ url: shrinkUrl, method, headers, body }, (error, response, body) => {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }
//                 if (!body) {
//                     throw new Error(`index.ts: response data should not be empty: ${body}`);
//                 }
//                 const result = JSON.parse(body);
//                 if (typeof result !== `object`) {
//                     throw new Error(`index.ts: unknown response data type: ${result}`);
//                 }
//                 if (!result) {
//                     throw new Error(`index.ts: response data is empty: ${result}`);
//                 }
//                 if (result.error) {
//                     reject(result);
//                     return;
//                 }
//                 resolve(JSON.parse(body));
//             });
//         });
//     }
//     download(url) {
//         return new Promise((resolve, reject) => {
//             const transform = new stream_1.Transform();
//             request({ url, strictSSL: false })
//                 .on('data', function (chunk) {
//                 transform.push(chunk);
//             })
//                 .on('end', function () {
//                 const buffer = transform.read();
//                 resolve(buffer);
//             })
//                 .on('error', (error) => {
//                 reject(error);
//             });
//         });
//     }
// }
// const tinyPng = new TinyPng();
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.default = tinyPng;