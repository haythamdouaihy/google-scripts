/***************************************************************************************
 ***************************************************************************************
 **************************************************************************************/
/**
/**
 * Returns Array of all sheet names.
 *
 * @return {Array} an array of all active players.
 * @customfunction
 */
function getListOfSheetNames() {
  try {
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    var out = new Array( sheets.length );
    
    for (var i = 0 ; i < sheets.length ; i++ ) 
      out[i] = [sheets[i].getName()];
    
    Logger.log('list of sheets: ' + out);
    return out;  
  }
  catch( err ) {
    return "#ERROR!" 
  }
}
/***************************************************************************************
 ***************************************************************************************
 **************************************************************************************/
/**
 * Returns List of a column range values inside a sheet.
 *
 * @return {Array} a list of a column range values inside a sheet.
 * @customfunction
 */
function getValuesForColumn(sheetName, columnIndex) {
  try {
//    var currentSheet = SpreadsheetApp.getActiveSheet();
    var currentSheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var data = currentSheet.getDataRange().getValues();
    
    var arr = [];
    // starting with row no1. first row contains the headers --> not needed
    for(i=1; i < data.length; i++) {
      arr.push(data[i][columnIndex-1])
    }
    
    return cleanArray(arr);
  }
  catch( err ) {
    return "#ERROR!" 
  }
}
function testGetSheetColumnValues() {
  Logger.log(getValuesForColumn('players', 3));
}
/***************************************************************************************
 ***************************************************************************************
 **************************************************************************************/
/**
 * Returns an Object out from a row.
 *
 * @return {Object} an Object from a row given its position and its columns location.
 * @customfunction
 */
function getRowAsAnObject(sheetName, headerRowIndex, headerFirstColumnIndex, headerLastColumnIndex, rowIndex) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var tableLength = headerLastColumnIndex - headerFirstColumnIndex + 1;
  
  // break apart the range to avoid any existing multiple-column cell
  // break apart doesn't work from spreadsheet (not allowed to add/edit/delete, just get)
//  var columns = sheet.getRange(headerRowIndex, headerFirstColumnIndex, 1, tableLength).breakApart().getDisplayValues()[0];
  var columns = sheet.getSheetValues(headerRowIndex, headerFirstColumnIndex, 1, tableLength)[0];
  
  //setting the column name like its adjacent one in case of multiple columns
  columns.forEach(function(element, index){
    if(element === undefined || element === '') {
      columns[index] = columns[index-1].split('-')[0].concat('-').concat(index);;
    }
  });
  
  var row = sheet.getSheetValues(rowIndex, headerFirstColumnIndex, headerLastColumnIndex, tableLength)[0];

  var result = constructObjectFromArrays(columns, row);
  
  return result;
  
}
function testGetRowAsAnObject() {
//  Logger.log(getRowAsAnObject('logs', 1, 1, 24, 2));
  Logger.log(getRowAsAnObject('players', 1, 2, 8, 2));
}
/***************************************************************************************
 ***************************************************************************************
 **************************************************************************************/
/**
 * Returns an Array of Objects out from a range.
 *
 * @return {Array} an Array of Objects out of a given range
 * @customfunction
 */
function rangeToListOfObjects(sheetName,firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  var list = [];
  var rowObject = {};
  for(i=firstRowIndex; i < lastRowIndex+1; i++) {
    rowObject = getRowAsAnObject(sheetName, firstRowIndex, firstColumnIndex, lastColumnIndex, i);
    list.push(rowObject);
  }
   
  return list;
}
function testRangeToListOfObjects() {
  Logger.log(rangeToListOfObjects('players', 1, 39, 2, 8));
}
/***************************************************************************************
 ***************************************************************************************
 **************************************************************************************/


