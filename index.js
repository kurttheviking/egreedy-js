var _ = require('lodash');
var BPromise = require('bluebird');
var debug = require('debug')('egreedy');

var async = BPromise.method;

function Algorithm(options) {
  var opts = options || {};

  if (!(this instanceof Algorithm)) {
    return new Algorithm(opts);
  }

  debug('init', opts);

  this.arms = _.isUndefined(opts.arms) ? 2 : parseInt(opts.arms, 10);
  this.epsilon = _.isUndefined(opts.epsilon) ? 0.5 : parseFloat(opts.epsilon);

  if (this.arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  } else if (this.epsilon < 0) {
    throw new TypeError('invalid epsilon: cannot be less than 0');
  } else if (this.epsilon > 1) {
    throw new TypeError('invalid epsilon: cannot be greater than 1');
  }

  this.counts = Array.apply(null, Array(this.arms)).map(Number.prototype.valueOf, 0);
  this.values = Array.apply(null, Array(this.arms)).map(Number.prototype.valueOf, 0);
}

Algorithm.prototype.load = async(require('./lib/load'));
Algorithm.prototype.reward = async(require('./lib/reward'));
Algorithm.prototype.select = async(require('./lib/select'));
Algorithm.prototype.serialize = async(require('./lib/serialize'));

module.exports = Algorithm;
