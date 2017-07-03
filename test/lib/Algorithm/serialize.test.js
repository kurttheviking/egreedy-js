/* global describe, it */
/* eslint-disable global-require, import/no-extraneous-dependencies */

const expect = require('chai').expect;

const randomInteger = require('../../utils/randomInteger');

describe('Algorithm#serialize', () => {
  const Algorithm = require('../../../index');

  const arms = randomInteger(2, 20);
  const config = {
    arms
  };

  const emptyArray = new Array(arms).fill(0);

  it('returns a valid state', () => {
    const alg = new Algorithm(config);

    return alg.serialize().then((state) => {
      expect(state.arms).to.equal(arms);
      expect(state.counts).to.deep.equal(emptyArray);
      expect(state.values).to.deep.equal(emptyArray);
    });
  });
});
