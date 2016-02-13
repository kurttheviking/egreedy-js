var lint = require('mocha-eslint');

var options = {};
var paths = [
  'lib',
  'index.js'
];

options.formatter = 'compact';

lint(paths, options);
