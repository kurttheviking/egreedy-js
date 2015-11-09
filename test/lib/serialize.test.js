/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm#serialize', function() {
  var Algorithm = require('../../index');
  var arms = _.random(1, 10);
  var config = {
    arms: arms,
    epsilon: _.random(0, 1, true)
  };

  it('returns a valid state', function() {
    var alg = new Algorithm(config);

    var expected = _.cloneDeep(config);
    expected.counts = Array.apply(null, Array(arms)).map(Number.prototype.valueOf, 0);
    expected.values = Array.apply(null, Array(arms)).map(Number.prototype.valueOf, 0);

    return alg.serialize().then(function(state) {
      expect(state).to.have.property('arms', config.arms);
      expect(state).to.have.property('epsilon', config.epsilon);

      expect(state).to.have.property('counts');
      expect(state.counts).to.deep.equal(expected.counts);

      expect(state).to.have.property('values');
      expect(state.values).to.deep.equal(expected.values);
    });
  });
});
