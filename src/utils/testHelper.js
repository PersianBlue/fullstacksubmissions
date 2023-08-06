const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const testHelper = (testFunc, testParams, expectedResult) => {
  const result = testFunc(testParams);
  console.log(result);
  if (isObject(expectedResult)) {
    return expect(result).toEqual(expectedResult);
  }
  return expect(result).toBe(expectedResult);
};

module.exports = testHelper;
