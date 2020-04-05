'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const path = require('path');
const dist = path.resolve(__dirname, '../dist');
const src = path.resolve(__dirname, '../src');

module.exports = {
  devtool: 'source-map',
  entry: './client/src/index.js',
  output: {
    publicPath: '/',
    path: dist,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      __cli: src
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: [/\.css$/],
        use: ['vue-style-loader', 'style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: src + '/static',
        to: dist + '/static',
        toType: 'dir'
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: src + '/index.html' }),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      allowAsyncCycles: false,
      cwd: process.cwd()
    })
  ]
};