var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  devtool: 'eval',
  entry: [
    path.join(__dirname, 'src' , 'main.js')
  ],
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'tib.js'
  },

  module: {
    loaders: []
  },

  plugins: [
    new webpack.DefinePlugin({  
      'process.env':{  
          'NODE_ENV': JSON.stringify('production')
      },
      DEV: false
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin()
  ],
}