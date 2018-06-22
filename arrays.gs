/**
 * Returns Array clean of empty, undefined, or space values.
 *
 * @return {Array} Array clean of empty, undefined, or space values.
 * @customfunction
 */
function cleanArray(array) {
  for(i=array.length-1; i>=0; i--) {
    if(array[i] === undefined || (typeof array[i] === 'string' && array[i].trim() === '')) {
      array.splice(i,1);
    }
  }
  return array;
}

function testCleanArray() {
  var array = [1,2,3,,,];
  Logger.log("cleaned: " + cleanArray(array));
}

/**
 * Combines a header array with a values array to construct an object
 *
 * @return {Object} Object where keys are the headerArray, and values are the valuesArray.
 * @customfunction
 */               
function constructObjectFromArrays(headerArray, valuesArray) {
  return valuesArray.reduce(function(result, field, index) {
    result[headerArray[index]] = field;
    return result;
  }, {}); 
}

function testConstructObjectFromArrays() {
  var result = constructObjectFromArrays(['a','b','c'], [1,2,3]);
  Logger.log(result);
}
