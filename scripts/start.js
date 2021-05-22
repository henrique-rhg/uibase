"use strict";

const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = 3232;

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../config/webpack.config.development');
const paths = require('../config/paths');
const options = {
  contentBase: paths.public,
  publicPath: config.output.publicPath,
  compress: true,
  clientLogLevel: 'none',
  hot: true, 
  open: true,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/
  },
  host: HOST,
  port: PORT
};

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

webpackDevServer.addDevServerEntrypoints(config, options);

var buildNumber = 0;

const compiler = webpack(config);

compiler.hooks.done.tap('done', (stats) => {
  const messages = stats.toJson({}, true);
  const isSuccess = !messages.errors.length && !messages.warnings.length;

  buildNumber++;

  if (1 == buildNumber) {
    clearConsole();

    if (isSuccess) {
      console.log(chalk.green('Compiled successfully!'));
    }

    console.log();
    console.log('The app is running at:');
    console.log();
    console.log('  ' + chalk.cyan(PROTOCOL + '://' + HOST + ':' + PORT + '/'));
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

const server = new webpackDevServer(compiler, options);

server.listen(PORT, 'localhost', (error) => {
  if (error) {
    return console.log(error);
  }

  clearConsole();

  console.log(chalk.cyan('Starting the development server...'));
  console.log();
});
