/* global describe, it, beforeEach, afterEach */
/* eslint func-names: 0*/
var _ = require('lodash');
var BPromise = require('bluebird');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');

var expect = chai.expect;

describe('Algorithm#select', function () {
  var Algorithm;
  var arms = _.random(1, 10);
  var config = { arms: arms, epsilon: _.random(0, 1, true) };
  var debugSpy;

  beforeEach(function () {
    debugSpy = sinon.spy();

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('debug', function (name) {
      if (name === 'egreedy:select') {
        return debugSpy;
      }

      return sinon.spy();
    });

    Algorithm = require('../../../index');  // eslint-disable-line global-require
  });

  afterEach(function () {
    mockery.disable();
  });

  it('returns a number', function () {
    var alg = new Algorithm(config);

    alg.select().then(function (arm) {
      expect(arm).to.be.a('number');
    });
  });

  it('returns a valid arm', function () {
    var alg = new Algorithm(config);
    var trials = _.times(_.random(10, 20), alg.select.bind(alg));

    return BPromise.all(trials).then(function (selections) {
      expect(selections.length).to.equal(trials.length);

      selections.forEach(function (choice) {
        expect(choice).to.be.a('number');
        expect(choice).to.be.below(arms);
      });
    });
  });

  it('can always exploit', function () {
    var configTest = _.assign(
      _.cloneDeep(config),
      {
        epsilon: 0,
        counts: _.times(arms, _.constant(1)),
        values: _.times(arms, _.constant(1))
      }
    );

    var alg = new Algorithm(configTest);
    var trials = _.times(_.random(10, 20), alg.select.bind(alg));

    return BPromise.all(trials).then(function (selections) {
      expect(selections.length).to.equal(trials.length);

      debugSpy.args.forEach(function (messageArgs) {
        expect(messageArgs[0].indexOf('exploit')).to.equal(0);
      });
    });
  });

  it('can always explore', function () {
    var configTest = _.assign(
      _.cloneDeep(config),
      {
        epsilon: 1,
        counts: _.times(arms, _.constant(1)),
        values: _.times(arms, _.constant(1))
      }
    );

    var alg = new Algorithm(configTest);
    var trials = _.times(_.random(10, 20), alg.select.bind(alg));

    return BPromise.all(trials).then(function (selections) {
      expect(selections.length).to.equal(trials.length);

      debugSpy.args.forEach(function (messageArgs) {
        expect(messageArgs[0].indexOf('explore')).to.equal(0);
      });
    });
  });
});
