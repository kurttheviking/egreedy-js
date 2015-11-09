/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm#reward', function() {
  var Algorithm = require('../../index');
  var arms = _.random(1, 10);
  var config = {
    arms: arms,
    epsilon: _.random(0, 1, true)
  };

  it('updates the values and counts accumulators', function() {
    var arm = _.random(0, arms - 1);
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    alg.reward(arm, val).then(function() {
      expect(alg.counts[arm]).to.equal(1);
      expect(alg.values[arm]).to.equal(val);

      expect(_.sum(alg.counts)).to.equal(1);
      expect(_.sum(alg.values)).to.equal(val);
    });
  });

  it('resolves to the total count of observed rounds', function() {
    var arm = _.random(0, arms - 1);
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    alg.reward(arm, val).then(function(out) {
      expect(out).to.equal(1);
    });
  });

  it('throws if the arm index is null', function() {
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    return alg.reward(null, val).catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the arm index is negative', function() {
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    return alg.reward(-1, val).catch(function(err) {
      expect(err).to.match(/ arm index out of bounds/);
    });
  });

  it('throws if the arm index exceeds total arms', function() {
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    return alg.reward(config.arms * 10, val).catch(function(err) {
      expect(err).to.match(/ arm index out of bounds/);
    });
  });

  it('throws if the arm index is undefined', function() {
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    return alg.reward(undefined, val).catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the arm index is not a number', function() {
    var alg = new Algorithm(config);
    var val = _.random(0, 1, true);

    return alg.reward('0', val).catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the reward is null', function() {
    var alg = new Algorithm(config);

    return alg.reward(0, null).catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });

  it('throws if the reward is undefined', function() {
    var alg = new Algorithm(config);

    return alg.reward(0, undefined).catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });

  it('throws if the reward is not a number', function() {
    var alg = new Algorithm(config);

    return alg.reward(0, '1').catch(function(err) {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });
});
