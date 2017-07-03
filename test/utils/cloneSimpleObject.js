function cloneSimpleObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = cloneSimpleObject;
