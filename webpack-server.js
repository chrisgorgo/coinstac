'use strict';
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    contentBase: './app/'
}).listen(3000, 'localhost', function (err, result) { // jshint ignore:line
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:3000');
});
