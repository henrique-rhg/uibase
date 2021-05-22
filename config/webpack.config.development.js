"use strict";

const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: paths.context,
  entry: {
    index: `${paths.source}/${paths.main}`
  },
  output: {
    path: paths.output.path,
    pathinfo: true,
    filename: `${paths.assets}/js/${paths.output.name.replace(/\.\[ext\]$/, '.js')}`,
    clean: true,
    publicPath: paths.output.basepath
  },
  resolve: {
    extensions: paths.extensions
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [   
                [
                  "@babel/preset-env",
                  {
                    loose: true
                  }
                ],
                [
                  "@babel/preset-react"
                ],
                [
                  "@babel/preset-typescript"
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: `${paths.assets}/media/${paths.output.name}`
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, 
      template: `${paths.public}/${paths.template}`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
