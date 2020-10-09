const path = require('path');
const webpack = require('webpack');
const internalIp = require('internal-ip');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  devtool: 'inline-source-map',

  entry: {
    tib: ['./main.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  devServer:{
    contentBase: path.resolve(__dirname, './src')
  },

  plugins: [
    new CleanWebpackPlugin(),
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

console.log('');
console.log('\x1b[36m' + 'App available on:', ' \x1b[0m');
console.log('    \x1b[1m' + 'http://0.0.0.0:8080')
console.log('    \x1b[1m' + 'http://' + internalIp.v4.sync() + ':8080')
console.log('\x1b[0m');