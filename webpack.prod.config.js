const path                 = require('path');
const webpack              = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin    = require("extract-text-webpack-plugin");
const version              = require('./package.json').version;
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
    new webpack.DefinePlugin({
      'process.env':{
        'VERSION': JSON.stringify(version)
      },
      'DEV': false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      // analyzerPort: 8888,
      reportFilename: './report.html',
      generateStatsFile: false,
      // statsFilename: 'stats.json',
      logLevel: 'info',
      openAnalyzer: false
    }),
    new ExtractTextPlugin('[name].css'),
    new CleanWebpackPlugin(['dist'])
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
        use: ExtractTextPlugin.extract([
          'css-loader','postcss-loader','less-loader'
        ])
      }
    ]
  }
}