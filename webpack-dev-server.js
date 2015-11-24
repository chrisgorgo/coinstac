'use strict';
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var port = 3000;
process.env.COINS_ENV = 'development';
var config = require('./webpack.config');
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    contentBase: './app/',
    colors: true
}).listen(port, 'localhost', function (err, result) { // jshint ignore:line
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:' + port);
});
