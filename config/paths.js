"use strict";

const path = require('path');
const packageJson = require(path.resolve('./package.json'));

var options = Object.assign({
  "extensions": [ ".js", ".jsx", ".ts", ".json", ".scss", ".sass" ],
  "context": path.join(__dirname, '../'),
  "source": "./src",
  "public": "./public",
  "main": "index.js",
  "template": "index.html",
  "assets": "static",
  "output": {
    "path": "dist",
    "name": "[name]-bundle.[ext]",
    "basepath": "/"
  }
}, packageJson.options);

if (packageJson.main) {
  options.main = packageJson.main;
}

options.output.path = path.resolve(options.context, options.output.path);

module.exports = options;
