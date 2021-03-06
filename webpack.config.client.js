const path = require('path');
const Dotenv = require('dotenv-webpack');
// const theme = require('./theme');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config({ path: __dirname + '/.env' });

// const optimization = {};

const optimization = {
  splitChunks: {
    cacheGroups: {
      // styles: {
      //   name: 'styles',
      //   test: /.css$/,
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 20
      // },
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'modules',
        chunks: 'all'
      }
    },
  }
};

// https://andyyou.github.io/2016/05/30/webpack-dev-middleware-in-express/
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    path.resolve(__dirname, 'script/reactApp.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    // filename: 'index.js',
    // filename: '[name].js',
    // chunkFilename: '[name].js',
    filename: (pathData) => {
      return pathData.chunk.name === 'main' ? 'javascripts/index.js' : 'javascripts/[name].js';
    }
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'script/public/assets/'),
      routes: path.resolve(__dirname, 'script/routes'),
      components: path.resolve(__dirname, 'script/views/components/'),
      layouts: path.resolve(__dirname, 'script/views/layouts/'),
      utils: path.resolve(__dirname, 'script/utils/'),
      services: path.resolve(__dirname, 'script/services/'),
      node_modules: path.resolve(__dirname, './node_modules'),
      public: path.resolve(__dirname, 'script/public'),
    },
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
      }, {
        loader: 'less-loader',
        options: {
          // modifyVars: theme,
          // javascriptEnabled: true,
          modules: true
        }
      }],
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
      test: /\.(png|jpg)$/,
      include: path.join(__dirname, 'public/assets'),
      loader: 'file-loader'
    }, {
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    },
    { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
    {
      test: /\.(jpe?g|png|gif|svg|png|woff|woff2|eot|ttf|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 100000 }
        },
        'image-webpack-loader'
      ]
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader'
      ],
    }],
  },
  plugins: [
    new Dotenv({
      // path: './.env', // load this now instead of the ones in '.env'
      // safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      // systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      // silent: true, // hide any errors
      // defaults: false // load '.env.defaults' as the default values if empty.
    }),
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        return pathData.chunk.name === 'main' ? 'stylesheets/styles.css' : 'stylesheets/[name].css';
      },
    }),
  ],
  optimization
};