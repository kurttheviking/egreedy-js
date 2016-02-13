var _ = require('lodash');
var debug = require('debug')('egreedy:reward');

function reward(arm, val) {
  var ct;
  var prior;

  debug('reward arm %s with %s', arm, val);

  if (!_.isNumber(arm)) {
    throw new TypeError('missing or invalid required parameter: arm');
  } else if (arm >= this.arms || arm < 0) {
    throw new TypeError('arm index out of bounds');
  } else if (!_.isNumber(val)) {
    throw new TypeError('missing or invalid required parameter: reward');
  }

  ct = ++this.counts[arm];
  prior = this.values[arm];

  debug('prior value: %s', prior);

  this.values[arm] = ((ct - 1) / ct) * prior + (1 / ct) * val;

  debug('posterior value: %s', this.values[arm]);

  return _.sum(this.counts);
}

module.exports = reward;
