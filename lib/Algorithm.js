const debug = require('debug')('ucb');
const has = require('has');

const promisify = require('./utils/promisify');

const reward = require('./Algorithm/reward');
const select = require('./Algorithm/select');
const serialize = require('./Algorithm/serialize');

function Algorithm(opts) {
  const options = opts || {};

  if (!(this instanceof Algorithm)) {
    return new Algorithm(options);
  }

  debug('init', options);

  this.arms = options.arms === undefined ? 2 : parseInt(options.arms, 10);
  this.epsilon = options.epsilon === undefined ? 0.5 : parseFloat(options.epsilon);

  if (this.arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  } else if (this.epsilon < 0) {
    throw new TypeError('invalid epsilon: cannot be less than 0');
  } else if (this.epsilon > 1) {
    throw new TypeError('invalid epsilon: cannot be greater than 1');
  }

  if (has(options, 'counts') && has(options, 'values')) {
    if (!Array.isArray(options.counts)) {
      throw new TypeError('counts must be an array');
    } else if (!Array.isArray(options.values)) {
      throw new TypeError('values must be an array');
    } else if (options.counts.length !== this.arms) {
      throw new Error('arms and counts.length must be identical');
    } else if (options.values.length !== this.arms) {
      throw new Error('arms and values.length must be identical');
    }

    this.counts = options.counts.slice(0);
    this.values = options.values.slice(0);
  } else {
    this.counts = new Array(this.arms).fill(0);
    this.values = new Array(this.arms).fill(0);
  }
}

Algorithm.prototype.reward = promisify(reward);
Algorithm.prototype.select = promisify(select);
Algorithm.prototype.serialize = promisify(serialize);

module.exports = Algorithm;
