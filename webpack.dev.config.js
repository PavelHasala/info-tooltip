const path = require('path');
const webpack = require('webpack');
console.log(process.env.NODE_ENV)
module.exports = {
  devtool: 'source-map',
  devServer:{
    contentBase: 'build/'
  },

  entry: [
    'webpack/hot/dev-server',
    './src/main.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'tib.js'
  },


  plugins: [
    new webpack.DefinePlugin({  
      'process.env':{  
          'NODE_ENV': JSON.stringify('development')
      },
      DEV: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
};