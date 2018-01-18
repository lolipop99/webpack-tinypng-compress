# tinypng-compress

a images compress plugin use with tinyPNG for webpack.

## get tinyPNG key

[link](https://tinypng.com/developers)

## Installation

`$ npm install tinypng-compress --save-dev`

## Example Webpack Config

```javascript
var tinypngCompress = require('tinypng-compress');

    //in your webpack plugins array
    module.exports = {
        plugins: [
            new tinypngCompress()
        ]
    }
```

## 编译提示

默认在`process.env.NODE_ENV = production`开启此功能，编译所有webpack assets的图片资源(gif、jpg、jpeg、png)。



## License
http://www.opensource.org/licenses/mit-license.php