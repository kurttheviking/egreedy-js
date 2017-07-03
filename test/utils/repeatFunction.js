function repeatFunction(x) {
  return (f) => {
    if (x > 0) {
      f();
      repeatFunction(x - 1)(f);
    }
  };
}

module.exports = repeatFunction;
