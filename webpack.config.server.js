const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './script/bin/wwwboot.js'
  ],
  target: 'node',
  externals: [
    nodeExternals(),
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'server.js',
  },
  resolve: {
    alias: {
      Script: path.resolve(__dirname, './script/'),
      Sslcert: path.resolve(__dirname, './sslcert/'),
      Controllers: path.resolve(__dirname, './script/controllers/'),
      Middlewares: path.resolve(__dirname, './script/middlewares/'),
      Models: path.resolve(__dirname, './script/models/'),
      Routes: path.resolve(__dirname, './script/routes/'),
      Services: path.resolve(__dirname, './script/services/'),
      Socket: path.resolve(__dirname, './script/socket/'),
      node_modules: path.resolve(__dirname, './node_modules/'),
    },
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    },
    { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  plugins: [
    new CopyPlugin({
      patterns:[
        { from:path.resolve(__dirname, './script/views'), to:path.resolve(__dirname, './dist/views') },
        { from:path.resolve(__dirname, './script/public'), to:path.resolve(__dirname, './dist/public') },
      ]
    })
  ],
};