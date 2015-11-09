/* global describe, it */
/* eslint func-names: 0*/
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm', function() {
  var Algorithm = require('../index');

  it('does not require new keyword', function() {
    function test() {
      return require('../index')();
    }

    expect(test).to.not.throw(Error);
  });

  it('throws TypeError when passed arms=0', function() {
    function test() {
      var alg = new Algorithm({arms: 0});
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed arms<0', function() {
    function test() {
      var alg = new Algorithm({arms: -1});
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed epsilon<0', function() {
    function test() {
      var alg = new Algorithm({epsilon: -1});
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid epsilon: cannot be less than 0/);
    }
  });

  it('throws TypeError when passed epsilon>1', function() {
    function test() {
      var alg = new Algorithm({epsilon: 2});
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid epsilon: cannot be greater than 1/);
    }
  });
});
