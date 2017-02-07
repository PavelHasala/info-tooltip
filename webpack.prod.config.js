var path = require('path');
var webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        'NODE_ENV': JSON.stringify('production')
      },
      'DEV': false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
      minify: false
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!less-loader'
        })
      }
    ]
  }
}