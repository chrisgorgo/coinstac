var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/app',
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './js/index.js'
    ],
    output: {
        path: __dirname + '/app/build',
        filename: 'bundle.js'
    },
    externals: [
        {
            fs: 'commonjs fs',
            // pouchdb: 'commonjs pouchdb',
            ipc: 'commonjs ipc',
            config: 'commonjs config',
            sha: 'commonjs sha',
            path: 'commonjs path'
        }
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
        , {
            test: /\.jsx?$/,
            loaders: ['react-hot', 'babel?stage=0'],
            include: path.join(__dirname, 'app/js/')
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass?sourceMap'
        }]
    }
};
