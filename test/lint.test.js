var lint = require('mocha-eslint');

var options = {};
var paths = [
  'lib'
];

options.formatter = 'compact';

lint(paths, options);
