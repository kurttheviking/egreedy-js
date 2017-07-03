/* eslint-disable global-require, import/no-extraneous-dependencies, strict */

require('eslint');

const lint = require('mocha-eslint');

const options = {
  formatter: 'compact',
  timeout: 5000,
  slow: 1000
};

const paths = [
  'lib',
  'index.js'
];

lint(paths, options);
