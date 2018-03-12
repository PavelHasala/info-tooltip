const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  devtool: 'source-map',

  entry: {
    tib: ['./main.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './build'),
    publicPath: '/'
  },
  devServer:{
    contentBase: path.resolve(__dirname, './src')
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
          'NODE_ENV': JSON.stringify('development')
      },
      'DEV': true
    })
  ],

  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}