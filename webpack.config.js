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
        app: [
            './app/js/index.js'
        ]
    },
    // output: {
    //     path: path.join(__dirname + '/app/build', 'js'),
    //     filename: '[name].bundle.js', // one for each `entry`
    //     chunkFilename: "[id].chunk.js"
    // },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/app/build/js',
        publicPath: 'http://localhost:22222/assets/' // Required for webpack-dev-server
    },
    plugins: [
        // new CommonsChunkPlugin('global.bundle.js', ['tracker', 'main']),
          new webpack.NoErrorsPlugin()
    ],
    module: {
        // Load the react-hot-loader
        // loaders: [ { test: /\.jsx?$/, loaders: ['react-hot', 'jsx-loader'] } ]
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
