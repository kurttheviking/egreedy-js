/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var BPromise = require('bluebird');
var chai = require('chai');

var expect = chai.expect;

function _while(condition, action) {
  if (!condition()) {
    return BPromise.resolve();
  }

  return action().then(function() {
    return _while(condition, action);
  });
}

describe('simulation', function() {
  var alg;
  var Algorithm = require('../../index');
  var arms = _.random(10, 20);
  var config = {
    arms: arms,
    epsilon: _.random(0, 1, true)
  };
  var iterations = 100;
  var means;
  var play;

  this.timeout(1000);

  it('trends towards the true mean', function() {
    alg = new Algorithm(config);

    means = Array.apply(null, Array(arms)).map(function() {
      return _.random(0, 1, true);
    });

    play = function() {
      return alg.select().then(function(arm) {
        var x = (_.random(0, 1, true) < means[arm]) ? 1 : 0;
        return alg.reward(arm, x);
      });
    };

    return BPromise.resolve(
      _while(function() { return iterations--; }, play)
    ).then(function() {
      var diffs = alg.values.map(function(val, i) {
        return val - means[i];
      });

      diffs.forEach(function(diff) {
        expect(diff).to.be.above(-1);
        expect(diff).to.be.below(1);
      });
    });
  });
});
