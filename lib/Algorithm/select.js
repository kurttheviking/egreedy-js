const debug = require('debug')('egreedy:select');
const Random = require('random-js');

const random = new Random(Random.engines.mt19937().autoSeed());
const sum = require('../utils/sum');

function select() {
  const r = random.real(0, 1, true);
  const n = sum(this.counts);

  debug('threshold (e=%s vs r=%s)', this.epsilon, r);

  if (this.epsilon > r || n === 0) {
    return random.integer(0, this.arms - 1);
  }

  return this.values.indexOf(Math.max.apply(null, this.values));
}

module.exports = select;
