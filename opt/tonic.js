var Algorithm = require('egreedy');

var algorithm = new Algorithm();

algorithm.select().then(function updateArm(arm) {
  console.log('chose arm', arm);
  return algorithm.reward(arm, 1);
})
.then(function serializeAlgorithm() {
  return algorithm.serialize();
})
.then(function displayState(state) {
  console.log('new state', JSON.stringify(state, null, 2));
});
