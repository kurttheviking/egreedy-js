function reducer(out, value) {
  return out + value;
}

function sum(arr) {
  return arr.reduce(reducer);
}

module.exports = sum;
