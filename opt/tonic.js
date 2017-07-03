/* eslint-disable */

const Algorithm = require('egreedy');

const algorithm = new Algorithm();

algorithm.select().then((arm) => {
  console.log('chose arm', arm);
  return algorithm.reward(arm, 1);
})
.then(() => algorithm.serialize())
.then(state => console.log('new state', JSON.stringify(state, null, 2)));
