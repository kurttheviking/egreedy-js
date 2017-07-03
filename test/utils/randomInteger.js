/* eslint-disable import/no-extraneous-dependencies */
const Random = require('random-js');

const random = new Random(Random.engines.mt19937().autoSeed());

function randomInteger(min, max) {
  return random.integer(min, max);
}

module.exports = randomInteger;
