"use strict";

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const config = require('../config/webpack.config.development');
const paths = require('../config/paths');

function print(sumary, exceptions) {
  console.log(sumary);
  console.log();
  exceptions.forEach((except) => {
    console.log(except.message || except);
    console.log();
  });
}

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}

const compiler = Webpack(config);
const options = { ...config.devServer, open: true };

var buildNumber = 0;

compiler.hooks.done.tap('done', (stats) => {
  const messages = stats.toJson({}, true);
  const isSuccess = !messages.errors.length && !messages.warnings.length;
  const _port = options.port || 3000;
  const _host = options.host || '127.0.0.1';
  const _protocol = options.server.type || 'http';
  let _server = _protocol + '://' + _host;

  if (('http' == _protocol && '80' != _port) || ('https' == _protocol && '443' != _port)) {
    _server += ':' + _port;
  }

  buildNumber++;

  if (1 == buildNumber) {
    clearConsole();

    if (isSuccess) {
      console.log(chalk.green('Compiled successfully!'));
    }

    console.log();
    console.log('The app is running at:');
    console.log();
    console.log('  ' + chalk.cyan(_server));
    console.log();
    console.log('Note that the development build is not optimized.');
    console.log('To create a production build use ' + chalk.cyan('npm run build') + '.');
    console.log();
  } else {
    if (isSuccess) {
      console.log(chalk.green(`Compiled successfully #${buildNumber}!`));
    }
  }

  if (messages.errors.length) {
    print(chalk.red('Failed to compile.'), messages.errors);
    return;
  }

  if (messages.warnings.length) {
    print(chalk.yellow('Compiled with warnings.'), messages.warnings);
    console.log('You may use special comments to disable some warnings.');
  }
});

const server = new WebpackDevServer(options, compiler);

server.startCallback((error) => {
  if (error) {
    return console.log(error);
  }

  clearConsole();

  console.log(chalk.cyan('Starting the development server...'));
  console.log();
});
