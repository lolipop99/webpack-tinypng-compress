var path = require('path');
var TinyPNGPlugin = require('../index.js');

var tiny = new TinyPNGPlugin({
    relativePath: path.resolve(__dirname, 'img')
});

tiny.upload(path.resolve(__dirname, 'dist'));