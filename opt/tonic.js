/* eslint-disable no-console */

var Algorithm = require('egreedy');

var algorithm = new Algorithm();

algorithm.select().then(function rewardArm(arm) {
  console.log('chosen arm: ' + arm);
  return algorithm.reward(arm, 1);
})
.then(function () {
  return algorithm.serialize();
})
.then(function (state) {
  console.log('new state: ' + JSON.stringify(state, null, 2));
});
