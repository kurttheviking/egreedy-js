const debug = require('debug')('egreedy:serialize');

function serialize() {
  const out = {
    arms: this.arms,
    epsilon: this.epsilon,
    counts: this.counts.slice(0),
    values: this.values.slice(0)
  };

  debug('state', out);

  return out;
}

module.exports = serialize;
