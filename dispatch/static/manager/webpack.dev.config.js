var webpack = require('webpack');
var prodConfig = require('./webpack.config.js');

var devConfig = Object.create(prodConfig);

devConfig.devtool = 'source-map';
devConfig.debug = true;
devConfig.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development')
    }
  })
];

module.exports = devConfig;
