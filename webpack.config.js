module.exports = {

    entry: ['./src/index.js'],

    output: {
        path: __dirname + '/public/static/js/',
        publicPath: 'http://localhost:8080/public/static/js/',
        filename: 'build.js'
    },

    vue: {
        loaders: {
            sass: 'style!css!sass?indentedSyntax',
            scss: 'style!css!sass'
        },
        postcss: [
            require('lost')
        ]
    },


    module: {
        loaders: [
            // process *.vue files using vue-loader
            { test: /\.vue$/, loader: 'vue' },
            // process *.js files using babel-loader
            // the exclude pattern is important so that we don't
            // apply babel transform to all the dependencies!
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    }
}