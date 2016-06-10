var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: {
        article:   './src/js/article.jsx',
        component: './src/js/component.jsx',
        list:      './src/js/list.jsx'
    },
    output: {
        path: __dirname + '/dist/js',
        filename: '[name]-' + version + '.js'
    },
    module: {
      loaders: [
        {test: /\.jsx|.js$/, include: __dirname + '/src/js', loader: 'babel-loader'},
        {test: /\.jsx|.js$/, include: __dirname + '/node_modules/react-tabs', loader: 'babel-loader'}
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
};
