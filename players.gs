eturns Array of all players Abbv.
 *
 * @return {Array} an array of all players Abbv.
 * @customfunction
 */
function getPlayersAbbvrList(abbvrColumnIndex) {
  return getValuesForColumn('players', abbvrColumnIndex);
}

/**
 * Returns Array of all players Names.
 *
 * @return {Array} an array of all players Names.
 * @customfunction
 */
function getPlayersNamesList(namesColumnIndex) {
  return getValuesForColumn('players', namesColumnIndex);
}

/**
 * Returns Array of Objects of all players.
 *
 * @return {Array} an array of Objects of all players.
 * @customfunction
 */
function getPlayersListAll(firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex) {
  
//  var currentSheetName = SpreadsheetApp.getActiveSheet().getSheetName();
  var arrayOfPlayers = rangeToListOfObjects('players', firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex);
  return arrayOfPlayers;
}

/**
 * Returns Array of Objects of players with status given as a param .
 *
 * @return {Array} an array of Objects of players with status given as a param.
 * @customfunction
 */
function getPlayersListByStatus(firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex, status) {
//  var sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getSheetName();
  var arrayOfPlayers = rangeToListOfObjects('players', firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex);
  
  var x = arrayOfPlayers.filter(function(element) {    
    return element.ref === status
  });  
  return x.length;
}
function testGetPlayersListByStatus(){
  Logger.log(getPlayersListByStatus(1,39,2,8,'L'));
}


