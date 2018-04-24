#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const finder = require('find-package-json');
const generateStyleIndex = require('../lib/generate-style-index');

const argv = yargs
  .alias('p', 'path')
  .alias('s', 'syntax')
  .alias('v', 'verbose').argv;

const root = finder().next().filename;
const src = path.resolve(root, argv.path || './src/styles');
const syntax = argv.syntax || 'css';
const eventHandlers = argv.verbose
  ? {
      file(filepath) {
        console.log(filepath);
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
