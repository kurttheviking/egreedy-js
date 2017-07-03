function wrap(func) {
  return function wrapped() {
    const args = arguments;

    return Promise.resolve().then(() => func.apply(this, args));
  };
}

module.exports = wrap;
