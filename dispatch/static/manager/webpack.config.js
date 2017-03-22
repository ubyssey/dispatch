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
   rules: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       use: { loader: 'babel-loader' },
     },
     {
       test: /\.js$/,
        exclude: /node_modules/,
       enforce: 'pre',
        use: {
            loader: 'eslint-loader' ,
            options: {
                emitWarning: true,
            }
        }
     },
     {
       test: /\.scss$/,
       exclude: /node_modules/,
       use: [
         { loader: 'style-loader' },
         {
           loader: 'css-loader',
           options: {
             sourceMap: true
           }
         },
         {
           loader: 'sass-loader',
           options: {
             sourceMap: true
           }
         }
       ]
     },
     {
       test: /\.(png|jpg|woff|eot|ttf)$/,
        use: { loader: 'url-loader?limit=100000' }
     }
   ]
 },
 plugins: [
   new webpack.DefinePlugin({
     'process.env': {
       'NODE_ENV': JSON.stringify('production')
     }
   }),
   new webpack.optimize.UglifyJsPlugin()
 ]
};
