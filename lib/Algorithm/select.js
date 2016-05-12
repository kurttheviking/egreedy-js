var _ = require('lodash');
var debug = require('debug')('egreedy:select');

function select() {
  var arm;
  var n = _.sum(this.counts);

  if (this.epsilon > _.random(0, 1, true) || n === 0) {
    arm = _.random(0, this.arms - 1);
    debug('explore arm: %s', arm);
  } else {
    arm = this.values.indexOf(Math.max.apply(null, this.values));
    debug('exploit arm: %s', arm);
  }

  console.log(this);
  return arm;
}

module.exports = select;
