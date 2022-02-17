const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
// const CopyJavascript = require('./webpack/copy-javascript');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    server: path.resolve(__dirname, 'script/bin/wwwboot.js'),
  },
  target: 'node',
  externals: [
    nodeExternals(),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.css$/,
      use: {
        loader: 'css-loader'
      },
    }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './script/public'),
          to: path.resolve(__dirname, './dist/public'),
          force: true,
          globOptions: {
            ignore: [
              '**/video/*',
              '**/stylesheets/*',
            ],
          },
        }
      ],
    }),
    // new CopyJavascript({
    //   from: path.resolve(__dirname, './script/views'),
    //   to: path.resolve(__dirname, './dist/views'),
    // })
  ],
};