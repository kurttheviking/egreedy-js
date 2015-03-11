/* jslint node: true */
/* global describe, it */
'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');
var chai = require('chai');
var sinon = require('sinon');

chai.should();
chai.use(require('sinon-chai'));

var Bandit = require('../index');


describe('instance', function () {
  it ('throws TypeError when passed arms=0', function () {
    function init () {
      new Bandit({arms: 0});
    }

    chai.expect(init).to.throw(TypeError);
  });

  it ('throws TypeError when passed arms below 0', function () {
    function init () {
      new Bandit({arms: -1});
    }

    chai.expect(init).to.throw(TypeError);
  });

  it ('throws TypeError when passed below min epsilon', function () {
    function init () {
      new Bandit({epsilon: -1});
    }

    chai.expect(init).to.throw(TypeError);
  });

  it ('throws TypeError when passed above max epsilon', function () {
    function init () {
      new Bandit({epsilon: 2});
    }

    chai.expect(init).to.throw(TypeError);
  });

  describe('.select', function () {
    it('returns a promise', function () {
      var bandit = new Bandit();

      var res = bandit.select();

      var isValid = _.isFunction(res.then);
      chai.expect(isValid).to.equal(true);
    });

    it('resolves to a number', function () {
      var bandit = new Bandit();

      return bandit.select().then(function (arm) {
        var isValid = _.isNumber(arm);
        chai.expect(isValid).to.equal(true);
      });
    });

    it('resolves to an arm index less than total arms', function () {
      var interations = 100;
      var testArms = [];

      for (var i=0; i<interations; i++) {
        testArms.push(_.random(1, interations));
      }

      return BPromise.all(testArms.map(function (arms) {
        var bandit = new Bandit({arms: arms});
        return bandit.select();
      }))
      .then(function (results) {
        var isValid = true;

        testArms.forEach(function (arms, i) {
          if (results[i] > arms-1) {
            isValid = false;
          }
        });

        chai.expect(isValid).to.equal(true);
      });
    });

    it('does not increment observed sample size', function () {
      var bandit = new Bandit();
      var expected = bandit.n;

      return bandit.select().then(function () {
        var observed = bandit.n;
        chai.expect(observed).to.equal(expected);
      });
    });
  });

  describe('.reward', function () {
    it('returns a promise', function () {
      var bandit = new Bandit();

      var res = bandit.reward(0, 0);

      var isValid = _.isFunction(res.then);
      chai.expect(isValid).to.equal(true);
    });

    it('rejects with TypeError if no arm provided', function () {
      var noop = sinon.spy();
      var bandit = new Bandit();

      return bandit.reward().then(noop, function (err) {
        chai.expect(err).to.be.an.instanceof(TypeError);
        noop.should.have.callCount(0);
      });
    });

    it('rejects with TypeError if arm above max', function () {
      var noop = sinon.spy();
      var bandit = new Bandit();

      return bandit.reward(3, 0).then(noop, function (err) {
        chai.expect(err).to.be.an.instanceof(TypeError);
        noop.should.have.callCount(0);
      });
    });

    it('rejects with TypeError if arm below min', function () {
      var noop = sinon.spy();
      var bandit = new Bandit();

      return bandit.reward(-1, 0).then(noop, function (err) {
        chai.expect(err).to.be.an.instanceof(TypeError);
        noop.should.have.callCount(0);
      });
    });

    it('rejects with TypeError if reward is not a number', function () {
      var noop = sinon.spy();
      var bandit = new Bandit();

      return bandit.reward(0, '0').then(noop, function (err) {
        chai.expect(err).to.be.an.instanceof(TypeError);
        noop.should.have.callCount(0);
      });
    });

    it('resolves to updated cumulative rewards', function () {
      var bandit = new Bandit();
      var interations = 100;

      var testArm = [];
      var testReward = [];

      for (var i=0; i<interations; i++) {
        testArm.push(_.random(0, 1));
        testReward.push(_.random(0, 1));
      }

      return BPromise.all(testArm.map(function (arm, i) {
        var reward = testReward[i];
        return bandit.reward(arm, reward);
      }))
      .then(function (results) {
        var sum = [0, 0];
        var count = [0, 0];

        testArm.forEach(function (arm, i) {
          sum[arm] += testReward[i];
          count[arm]++;
        });

        var last = results[results.length-1];

        var isValidArm0 = Math.abs(last[0] - sum[0]/count[0]) < 0.000001;
        var isValidArm1 = Math.abs(last[1] - sum[1]/count[1]) < 0.000001;

        chai.expect(isValidArm0).to.equal(true);
        chai.expect(isValidArm1).to.equal(true);
      });
    });

    it('increments observed sample size', function () {
      var bandit = new Bandit();
      var interations = 100;

      var testArm = [];
      var testReward = [];

      for (var i=0; i<interations; i++) {
        testArm.push(_.random(0, 1));
        testReward.push(_.random(0, 1));
      }

      return BPromise.all(testArm.map(function (arm, i) {
        var reward = testReward[i];
        return bandit.reward(arm, reward);
      }))
      .then(function () {
        chai.expect(bandit.n).to.equal(interations);
      });
    });
  });

  describe('.serialize', function () {
    it('returns a promise', function () {
      var bandit = new Bandit();

      var res = bandit.serialize();

      var isValid = _.isFunction(res.then);
      chai.expect(isValid).to.equal(true);
    });

    it('resolves to snapshot of algorithm state', function () {
      var arms = 5;
      var epsilon = _.random(0, 1, true);
      var interations = 100;

      var bandit = new Bandit({
        arms: arms,
        epsilon: epsilon
      });

      var testArm = [];
      var testReward = [];

      for (var i=0; i<interations; i++) {
        testArm.push(_.random(0, arms-1));
        testReward.push(_.random(0, 1));
      }

      return BPromise.all(testArm.map(function (arm, i) {
        var reward = testReward[i];
        return bandit.reward(arm, reward);
      }))
      .then(function () {
        return bandit.serialize();
      })
      .then(function (pickle) {
        chai.expect(pickle.arms).to.equal(arms);
        chai.expect(pickle.epsilon).to.equal(epsilon);
        chai.expect(pickle.counts.length).to.equal(arms);
        chai.expect(pickle.values.length).to.equal(arms);
      });
    });
  });

  describe('.load', function () {
    it('resolves to restored values', function () {
      var arms = 5;
      var epsilon = _.random(0, 1, true);
      var interations = 100;

      var bandit = new Bandit({
        arms: arms,
        epsilon: epsilon
      });

      var expected;
      var testArm = [];
      var testReward = [];

      for (var i=0; i<interations; i++) {
        testArm.push(_.random(0, arms-1));
        testReward.push(_.random(0, 1));
      }

      return BPromise.all(testArm.map(function (arm, i) {
        var reward = testReward[i];
        return bandit.reward(arm, reward);
      }))
      .then(function () {
        return bandit.serialize();
      })
      .then(function (pickle) {
        expected = pickle.values;
        return bandit.load(pickle);
      })
      .then(function (values) {
        chai.expect(values).to.deep.equal(expected);
      });
    });

    // [KE] previous state is tested by validating that a serialized
    //      partial update can be restored and built into a state
    //      equivilent to a known full update
    it('restores previous state', function () {
      var arms = 5;
      var epsilon = _.random(0, 1, true);
      var interations = 100;

      var bandit = new Bandit({
        arms: arms,
        epsilon: epsilon
      });

      var testArm = [];
      var testReward = [];

      for (var i=0; i<interations; i++) {
        testArm.push(_.random(0, arms-1));
        testReward.push(_.random(0, 1));
      }

      var testArmPre = testArm.slice(0, interations/2);
      var testArmPost = testArm.slice(interations/2);
      var testRewardPre = testReward.slice(0, interations/2);
      var testRewardPost = testReward.slice(interations/2);

      return BPromise.all(testArmPre.map(function (arm, i) {
        var reward = testRewardPre[i];
        return bandit.reward(arm, reward);
      }))
      .then(function () {
        return bandit.serialize();
      })
      .then(function (pickle) {
        return bandit.load(pickle).then(function () {
          return BPromise.all(testArmPost.map(function (arm, i) {
            var reward = testRewardPost[i];
            return bandit.reward(arm, reward);
          }));
        });
      })
      .then(function (results) {
        var sum = [0, 0];
        var count = [0, 0];

        testArm.forEach(function (arm, i) {
          sum[arm] += testReward[i];
          count[arm]++;
        });

        var last = results[results.length-1];

        var isValidArm0 = Math.abs(last[0] - sum[0]/count[0]) < 0.000001;
        var isValidArm1 = Math.abs(last[1] - sum[1]/count[1]) < 0.000001;

        chai.expect(bandit.n).to.deep.equal(interations);
        chai.expect(isValidArm0).to.equal(true);
        chai.expect(isValidArm1).to.equal(true);
      });
    });
  });

});
