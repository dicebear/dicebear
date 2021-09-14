module.exports = function camelCaseToSpaceCase(val) {
  return val.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
    return str.toUpperCase();
  });
};
