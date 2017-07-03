/* global describe, it */
/* eslint-disable global-require, import/no-extraneous-dependencies */

const expect = require('chai').expect;

const randomInteger = require('../../utils/randomInteger');
const randomFloat = require('../../utils/randomFloat');

describe('Algorithm#reward', () => {
  const Algorithm = require('../../../index');

  const arms = randomInteger(2, 10);
  const config = {
    arms,
    epsilon: randomFloat(0, 1)
  };

  it('updates the values and counts accumulators', () => {
    const alg = new Algorithm(config);

    const arm = randomInteger(0, arms - 1);
    const val = randomInteger(0, 100) / 100;

    return alg.reward(arm, val).then(() => {
      expect(alg.counts[arm]).to.equal(1);
      expect(alg.values[arm]).to.equal(val);

      expect(alg.counts.reduce((accum, x) => accum + x)).to.equal(1);
      expect(alg.values.reduce((accum, x) => accum + x)).to.equal(val);
    });
  });

  it('updates the observation counter', () => {
    const alg = new Algorithm(config);

    const arm = randomInteger(0, arms - 1);
    const val = randomInteger(0, 100) / 100;

    const pre = alg.counts.reduce((out, x) => out + x);

    return alg.reward(arm, val).then(() => {
      const post = alg.counts.reduce((accum, x) => accum + x);

      expect(post).to.equal(pre + 1);
    });
  });

  it('resolves to the updated algorithm instance', () => {
    const alg = new Algorithm(config);

    const arm = randomInteger(0, arms - 1);
    const val = randomInteger(0, 100) / 100;

    return alg.reward(arm, val).then((out) => {
      expect(out).to.be.an.instanceof(Algorithm);

      expect(out.select).to.be.a('function');
      expect(out.reward).to.be.a('function');
      expect(out.serialize).to.be.a('function');
    });
  });

  it('throws if the arm index is null', () => {
    const alg = new Algorithm(config);

    const val = randomInteger(0, 100) / 100;

    return alg.reward(null, val).catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the arm index is negative', () => {
    const alg = new Algorithm(config);

    const val = randomInteger(0, 100) / 100;

    return alg.reward(-1, val).catch((err) => {
      expect(err).to.match(/ arm index out of bounds/);
    });
  });

  it('throws if the arm index exceeds total arms', () => {
    const alg = new Algorithm(config);

    const val = randomInteger(0, 100) / 100;

    return alg.reward(config.arms * 10, val).catch((err) => {
      expect(err).to.match(/ arm index out of bounds/);
    });
  });

  it('throws if the arm index is undefined', () => {
    const alg = new Algorithm(config);

    const val = randomInteger(0, 100) / 100;

    return alg.reward(undefined, val).catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the arm index is not a number', () => {
    const alg = new Algorithm(config);

    const val = randomInteger(0, 100) / 100;

    return alg.reward('0', val).catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: arm/);
    });
  });

  it('throws if the reward is null', () => {
    const alg = new Algorithm(config);

    return alg.reward(0, null).catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });

  it('throws if the reward is undefined', () => {
    const alg = new Algorithm(config);

    return alg.reward(0, undefined).catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });

  it('throws if the reward is not a number', () => {
    const alg = new Algorithm(config);

    return alg.reward(0, '1').catch((err) => {
      expect(err).to.match(/missing or invalid required parameter: reward/);
    });
  });
});
