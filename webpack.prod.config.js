const path                 = require('path');
const webpack              = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin    = require("extract-text-webpack-plugin");
const version              = require('./package.json').version;

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    tib: './main.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, './build'),
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
    new ExtractTextPlugin('[name].css')
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