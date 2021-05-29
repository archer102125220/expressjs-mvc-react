const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
// const CopyJavascript = require('./webpack/copy-javascript');

module.exports = {
  mode:process.env.NODE_ENV || 'development',
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
    }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './script/public'),
          to: path.resolve(__dirname, './dist/public'),
          force: true,
        },
        {
          from: path.resolve(__dirname, './.sequelizerc'),
          to: path.resolve(__dirname, './dist'),
          force: true,
        },
        {
          from: path.resolve(__dirname, './script/config/models/database.js'),
          to: path.resolve(__dirname, './dist/config/database.js'),
          force: true,
        },
        {
          from: path.resolve(__dirname, './script/models/server'),
          to: path.resolve(__dirname, './dist/models'),
          force: true,
        }
      ]
    }),
    // new CopyJavascript({
    //   from: path.resolve(__dirname, './script/views'),
    //   to: path.resolve(__dirname, './dist/views'),
    // })
  ],
};