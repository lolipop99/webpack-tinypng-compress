"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var axios = require('axios');
var webpackSources = require('webpack-sources');
var colors = require('colors');
var TinyPNGPlugin = (function () {
    function TinyPNGPlugin() {
    }
    TinyPNGPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('emit', function (compilation, callback) {
            var imgs = [];
            for (var filename in compilation.assets) {
                if (filename.match(/\.(png|jpg|jpeg|gif)/g))
                    imgs.push(filename);
            }
            if (!imgs.length)
                return callback();
            if (process.env.NODE_ENV !== 'production')
                return console.log(colors.green('默认【process.env.NODE_ENV = production】，才开启图片压缩功能！'));
            console.log('\n' + colors.blue('------------ compress img start ------------') + '\n');
            Promise.all(imgs.map(function (filename) {
                return _this.tinyCompress(compilation.assets, filename);
            })).then(function () {
                console.log('\n' + colors.blue('------------ compress img end ------------') + '\n');
                callback();
            });
        });
    };
    TinyPNGPlugin.prototype.tinyCompress = function (assets, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var img, url, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        img = assets[filename].source();
                        return [4, this.uploadPic(img)];
                    case 1:
                        url = _a.sent();
                        return [4, this.downloadPic(url)];
                    case 2:
                        data = _a.sent();
                        assets[filename] = new webpackSources.RawSource(data);
                        console.log(colors.green(filename, '=> success'));
                        return [2, Promise.resolve()];
                    case 3:
                        e_1 = _a.sent();
                        console.log(colors.red(filename, '=>fail'));
                        return [2, Promise.resolve()];
                    case 4: return [2];
                }
            });
        });
    };
    TinyPNGPlugin.prototype.uploadPic = function (data) {
        var headers = {
            "Referer": "https://tinypng.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Connection": "keep-alive",
            "Host": "tinypng.com"
        };
        var method = "post";
        var url = "https://tinypng.com/web/shrink";
        var body = data;
        return new Promise(function (resolve, reject) {
            axios({
                headers: headers,
                url: url,
                method: 'post',
                data: data
            }).then(function (res) {
                resolve(res.data.output.url);
            }, function (err) {
                reject(err);
            });
        });
    };
    TinyPNGPlugin.prototype.downloadPic = function (url) {
        return new Promise(function (resolve, reject) {
            axios({
                url: url,
                timeout: 10000,
                method: 'get',
                responseType: 'arraybuffer'
            }).then(function (res) {
                resolve(res.data);
            }, function (err) {
                reject(err);
            });
        });
    };
    return TinyPNGPlugin;
}());
module.exports = TinyPNGPlugin;
