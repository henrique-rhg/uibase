"use strict";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  mode: 'production',
  devtool: false,
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
            loader: "file-loader",
            options: {
              name: `${paths.assets}/css/${paths.output.name.replace(/\.\[ext\]$/, '.css')}`
            }
          },
          {
            loader: "extract-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              esModule: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: false,
              webpackImporter: false,
              sassOptions: {
                fiber: false
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true, 
    minimizer: [
      new TerserPlugin({
        exclude: /\/excludes/,
        extractComments: (astNode, comment) => {
          if (/@extract/i.test(comment.value)) {
            return true;
          }

          return false;
        }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, 
      template: `${paths.public}/${paths.template}`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ]
};
