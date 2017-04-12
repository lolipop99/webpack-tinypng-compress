# tinypng-webpack-plugin

a images compress plugin use with tinyPNG for webpack.

## get tinyPNG key

[link](https://tinypng.com/developers)

## Installation

`$ npm install webpack-tinypng-compress --save-dev`

## Example Webpack Config

```javascript
var tinypngCompress = require('webpack-tinypng-compress');

    //in your webpack plugins array
    module.exports = {
      plugins: [
          new tinypngCompress({
              key:"your tinyPNG key",
              relativePath: path.resolve(__dirname, 'dist/img') //is relative path to output.puth
          })
      ]
    }
```

## Usage
```javascript
new tinyPngWebpackPlugin({
    key: "your tinyPNG key", //can be Array, eg:['your key 1','your key 2'....]
    relativePath: path.resolve(__dirname, 'dist/img'), //is relative path to output.puth
})
```

### Options Description
* key: Required, tinyPNG key
* relativePath: Required, to your img dir,relative to your webpack output path.

### defaults Options
```javascript
    {
        key:'',
        relativePath:'./',
    }
```

## License
http://www.opensource.org/licenses/mit-license.php
