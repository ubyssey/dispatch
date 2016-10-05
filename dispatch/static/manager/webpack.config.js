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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
