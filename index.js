/* jslint node: true */
'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');


var Algorithm = function (options) {
  options = options || {};
  var self = this;

  if (!(self instanceof Algorithm)) {
    return new Algorithm(options);
  }

  var arms = _.isUndefined(options.arms) ? 2 : parseInt(options.arms, 10);
  var epsilon = _.isUndefined(options.epsilon) ? 0.5 : parseFloat(options.epsilon);
  var counts = [];
  var values = [];

  if (arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  }
  else if (epsilon < 0) {
    throw new TypeError('invalid epsilon: cannot be less than 0');
  }
  else if (epsilon > 1) {
    throw new TypeError('invalid epsilon: cannot be greater than 1');
  }

  for (var i=0; i<arms; i++) {
    counts.push(0);
    values.push(0);
  }

  function indexOfMax() {
    return values.indexOf(Math.max.apply(null, values));
  }

  var api = {};

  api.n = 0;

  api.load = function (config) {
    arms = config.arms;
    epsilon = config.epsilon;
    counts = config.counts;
    values = config.values;

    return BPromise.resolve(values);
  };

  api.reward = function (arm, reward) {
    return new BPromise(function (resolve, reject) {
      if (!_.isNumber(arm)) {
        return reject(new TypeError('missing or invalid required parameter: arm'));
      }
      else if (!_.isNumber(reward)) {
        return reject(new TypeError('missing or invalid required parameter: reward'));
      }
      else if (arm >= arms || arm < 0) {
        return reject(new TypeError('invalid arm: ' + arm + ' not in valid range (0-' + arms.length + ')'));
      }

      var ct = ++counts[arm];
      var pre = values[arm];
      var post = ((ct-1) / ct) * pre + (1/ct) * reward;

      values[arm] = post;

      api.n = _.reduce(counts, function (sum, ct) {
        return sum + ct;
      });

      resolve(values);
    });
  };

  api.select = function () {
    return new BPromise(function (resolve) {
      var arm;

      if (epsilon > _.random(0, 1, true) || api.n === 0) {
        arm = _.random(0, arms-1);
      } else {
        arm = indexOfMax();
      }

      resolve(arm);
    });
  };

  api.serialize = function () {
    return BPromise.resolve({
      arms: arms,
      epsilon: epsilon,
      counts: counts.slice(0),
      values: values.slice(0)
    });
  };

  return api;
};


module.exports = Algorithm;
