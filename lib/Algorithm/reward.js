const debug = require('debug')('egreedy:reward');

function reward(arm, value) {
  debug('reward arm %s with %s', arm, value);

  if (typeof arm !== 'number') {
    throw new TypeError('missing or invalid required parameter: arm');
  } else if (arm >= this.arms || arm < 0) {
    throw new TypeError('arm index out of bounds');
  } else if (typeof value !== 'number') {
    throw new TypeError('missing or invalid required parameter: reward');
  }

  const count = this.counts[arm] + 1;
  const prior = this.values[arm];

  this.counts[arm] = count;

  debug('prior value: %s', prior);

  this.values[arm] = (((count - 1) / count) * prior) + ((1 / count) * value);

  debug('posterior value: %s', this.values[arm]);

  return this;
}

module.exports = reward;
