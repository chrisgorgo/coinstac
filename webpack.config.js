var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var isDev = process.env.COINS_ENV === 'development';
var pluginCompress;
var fs = require('fs');

console.log(' >> ' + process.env.COINS_ENV);
module.exports = {
    entry: {
        tracker: './ampersand/app.js',
        main: './global-utils.js'
    },
    output: {
        path: path.join(__dirname + '/build', 'js'),
        publicPath: 'http://localhost:22222',
        filename: '[name].bundle.js', // one for each `entry`
        chunkFilename: "[id].chunk.js"
    },
    plugins: [
        new CommonsChunkPlugin('global.bundle.js', ['tracker', 'main']),
    ],
    module: {
        loaders: []
    },
    devServer: {
    }
};

// conditionally load extra configs
if (!isDev) {
    console.log(' >> uglifying (slow)');
    pluginCompress = new UglifyJsPlugin({
        compress: {
            warnings: false
        }
    });
    module.exports.plugins.push(pluginCompress);
};
