#!/usr/bin/env node
/**
 * @author Ricardo Henrique <henrique.rhg@gmail.com>
 */

"use strict";

const chalk = require('chalk');
const spawn = require('cross-spawn');

var name = process.argv[2],
    argv = process.argv.slice(3);

switch (name) {
  case 'start':
  case 'build':
    argv = [ require.resolve('../scripts/' + name) ].concat(argv);
    
    var result = spawn.sync('node', argv, { stdio: 'inherit' });
    
    if (!result.signal) {
      process.exit(result.status);
    }
    
    switch (result.signal) {
      case 'SIGTERM':
      case 'SIGKILL':
        console.log(chalk.yellow('The compilation failed because the process termination (SIGKILL).'));
        break;
    }
    
    console.log();
    process.exit(1);
    break;
  default:
    console.log(chalk.yellow(`Unknown script "${name}".`));
    console.log();
}
