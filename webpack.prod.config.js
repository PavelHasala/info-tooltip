const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const version = require('./package.json').version;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    tib: './main.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        'VERSION': JSON.stringify(version)
      },
      'DEV': false
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      // analyzerPort: 8888,
      reportFilename: './report.html',
      generateStatsFile: false,
      // statsFilename: 'stats.json',
      logLevel: 'info',
      openAnalyzer: false
    }),
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
        // exclude: /__dev__/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  }
};