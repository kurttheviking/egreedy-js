/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm', function () {
  var Algorithm = require('../../index');  // eslint-disable-line global-require

  var arms = _.random(1, 10);
  var state = {
    arms: arms,
    epsilon: _.random(0, 1, true),
    counts: _.times(arms, function () { return _.random(0, 10); }),
    values: _.times(arms, function () { return _.random(0, 1, true); })
  };

  it('does not require new keyword', function () {
    function test() {
      return require('../../index')();  // eslint-disable-line global-require
    }

    expect(test).to.not.throw(Error);
  });

  it('throws TypeError when passed arms=0', function () {
    function test() {
      var alg = new Algorithm({ arms: 0 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed arms<0', function () {
    function test() {
      var alg = new Algorithm({ arms: -1 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed epsilon<0', function () {
    function test() {
      var alg = new Algorithm({ epsilon: -1 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid epsilon: cannot be less than 0/);
    }
  });

  it('throws TypeError when passed epsilon>1', function () {
    function test() {
      var alg = new Algorithm({ epsilon: 2 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid epsilon: cannot be greater than 1/);
    }
  });

  it('restores instance properties from prior state', function () {
    var alg = new Algorithm(state);

    expect(alg.arms).to.equal(state.arms);
    expect(alg.epsilon).to.equal(state.epsilon);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
  });

  it('throws if counts is not an array', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.counts = _.random(0, 10);

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/counts must be an array/);
    }
  });

  it('throws if values is not an array', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.values = _.random(0, 10);

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/values must be an array/);
    }
  });

  it('throws if counts.length does not equal arm count', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.counts.pop();

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(Error);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/arms and counts.length must be identical/);
    }
  });

  it('throws if values.length does not equal arm count', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.values.pop();

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(Error);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/arms and values.length must be identical/);
    }
  });
});
