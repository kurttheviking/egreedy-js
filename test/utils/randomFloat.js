/* eslint-disable import/no-extraneous-dependencies */
const Random = require('random-js');

const random = new Random(Random.engines.mt19937().autoSeed());

function randomFloat(min, max) {
  return random.real(min, max, true);
}

module.exports = randomFloat;
