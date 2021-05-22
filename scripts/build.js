"use strict";

const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../config/webpack.config.production');
const fs = require('fs');
const path = require('path');

function print(sumary, exceptions) {
  console.log(sumary);
  console.log();
  exceptions.forEach((except) => {
    console.log(except.message || except);
    console.log();
  });
}

function remove(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  
  if (!fs.lstatSync(target).isDirectory()) {
    fs.unlinkSync(target);
    return;
  }
  
  fs.readdirSync(target).forEach(function (name) {
    remove(path.join(target, name));
  });
  fs.rmdirSync(target);
}

function copy(source, target, options) {
  if (!fs.existsSync(source)) {
    return;
  }
  
  options = options || {};
  options.reference = options.reference || '';
  options.ignore = options.ignore || [];
  
  if (!options.discardSize) {
    options.discardSize = target.replace(/\/$/, '').length + 1;
  }
  
  if (fs.lstatSync(source).isDirectory() && !fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  
  let files = [];
  
  fs.readdirSync(source).forEach((name) => {
    let nodeSource = path.join(source, name), 
        nodeTarget = path.join(target, name);
    
    if (options.ignore.find(function (value) {
      return value.replace(/\\/g, '/') == path.join(options.reference, name).replace(/\\/g, '/');
    })) {
      return;
    }
    
    if (fs.lstatSync(nodeSource).isDirectory()) {
      files = files.concat(copy(nodeSource, nodeTarget, {
        reference: path.join(options.reference, name),
        ignore: options.ignore, 
        discardSize: options.discardSize
      }));
      return;
    }
    
    let data = fs.readFileSync(nodeSource);
    
    fs.writeFileSync(nodeTarget, data);
    files.push({
      name: nodeTarget.substr(options.discardSize), 
      size: data.length
    });
  });
  
  return files;
}

remove(config.output.path);
console.log('Creating an optimized production build...');
webpack(config).run((except, stats) => {
  if (except) {
    print(chalk.red('Failed to compile.'), [except]);
    process.exit(1);
  }

  if (0 < stats.compilation.errors.length) {
    print(chalk.red('Failed to compile.'), stats.compilation.errors);
    process.exit(1);
  }

  if (process.env.CI && 0 < stats.compilation.warnings.length) {
    print(chalk.yellow('Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.'), stats.compilation.warnings);
    process.exit(1);
  }

  let data = stats.toJson();

  console.log(`Compiled ${chalk.green('successfully')} in ${data.time} ms.`);
  console.log();

  data.assets.map((asset) => {
    console.log(`  - ${chalk.cyan(asset.type)} ${chalk.green(asset.name)} ${asset.size} bytes`);
  });

  console.log();

  let publicDirname = './public/';

  if (fs.existsSync(publicDirname)) {
    console.log('Transferring extra files from the public folder...');
    console.log();

    copy(publicDirname, config.output.path, {
      ignore: [ 'index.html' ]
    }).forEach((file) => {
      console.log(`  - ${chalk.green(file.name)} ${file.size} bytes`);
    });

    console.log();
    console.log('Process finalized.');
    console.log();
  }

  console.log(`Output directed to '${chalk.dim(data.outputPath)}'.`);
  console.log();
});
