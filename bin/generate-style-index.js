#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const finder = require('find-package-json');
const generateStyleIndex = require('../lib/generate-style-index');

const ansi = {
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  reset: '\u001b[0m',
};

const argv = yargs
  .alias('p', 'path')
  .alias('s', 'syntax')
  .alias('v', 'verbose').argv;

const root = path.dirname(finder().next().filename);
const src = path.resolve(root, argv.path || './src/styles');
const syntax = argv.syntax || 'css';
const eventHandlers = argv.verbose
  ? {
      file(filepath) {
        console.log(
          `${ansi.green}[Generated] ${ansi.blue}${filepath}${ansi.reset}`
        );
      },
      before() {
        console.log('Generating styles index files...');
        console.log();
      },
      after() {
        console.log();
      },
    }
  : {};

generateStyleIndex(
  {
    root,
    src,
    syntax,
  },
  eventHandlers
).catch(err => {
  console.error(err.message);
});
