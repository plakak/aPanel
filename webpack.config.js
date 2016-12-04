var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  
  entry: ['./src/index.js'],
  
  output: {
    path: __dirname + '/public/static/aPanel/js/',
    publicPath: 'http://localhost:8080/public/static/aPanel/js/',
    filename: 'build.js'
  },
  vue: {
    loaders: {
      sass: 'style!css!sass?indentedSyntax',
      scss: 'style!css!sass',
      css: 'style-loader!css-loader!postcss-loader'
    }
  },
  module: {
    loaders: [
      // process *.vue files using vue-loader
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/}
    ]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
};
