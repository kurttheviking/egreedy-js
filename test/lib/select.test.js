/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var BPromise = require('bluebird');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm#select', function() {
  var Algorithm = require('../../index');
  var arms = _.random(1, 10);
  var config = {
    arms: arms,
    epsilon: _.random(0, 1, true)
  };

  it('returns a number', function() {
    var alg = new Algorithm(config);

    alg.select().then(function(arm) {
      expect(arm).to.be.a('number');
    });
  });

  it('returns a valid arm', function() {
    var alg = new Algorithm(config);
    var iterations = _.random(10, 20);
    var trials = Array.apply(null, Array(iterations)).map(Number.prototype.valueOf, -1);

    trials = trials.map(function() {
      return alg.select();
    });

    return BPromise.all(trials).then(function(selections) {
      expect(selections.length).to.equal(trials.length);

      selections.forEach(function(choice) {
        expect(choice).to.be.a('number');
        expect(choice).to.be.below(arms);
      });
    });
  });
});
