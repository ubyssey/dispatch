var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
  entry: {
    index:  './src/js/index.js',
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name]-' + version + '.js'
  },
  module: {
    loaders: [
      {test: /\.jsx|.js$/, include: __dirname + '/src/js', loader: 'babel-loader'},
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
