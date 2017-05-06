
var gameFirstRowIndex = 1;
var gameLastRowIndex = 100;
var gameFirstColumnIndex = 1;
var gameLastColumnIndex = 24;

var listOfGamesDates = getAllGamesDates();
var arrayOfGames = rangeToListOfObjects('logs', 1, 70, 1, gameLastColumnIndex);
/**
 * Returns Array of Objects of all games.
 *
 * @return {Array} an array of Objects of all games.
 * @customfunction
 */
function getGamesListAll() {
  
//  var currentSheetName = SpreadsheetApp.getActiveSheet().getSheetName();
  var games = rangeToListOfObjects('logs', this.gameFirstRowIndex, this.gameLastRowIndex, this.gameFirstColumnIndex, this.gameLastColumnIndex);
  return games;
}
function testGetGamesListAll() {
  var x = getGamesListAll();
  Logger.log(x);
}

/**
 * Returns Array of Game Objects having date greater than the given date parameter.
 *
 * @return {Array} an array of Game Objects having date greater than the given date parameter.
 * @customfunction
 */
function getGamesListGreaterThanDate(firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex, date) {
  
//  var currentSheetName = SpreadsheetApp.getActiveSheet().getSheetName();
  var games = rangeToListOfObjects('logs', firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex);
  
  var x = games.filter(function(element) {
    return element.date >= date;
  });  
  return x;
}
function testgetGamesListGreaterThanDate() {
  var x = getGamesListGreaterThanDate(1,57,1,this.gameLastColumnIndex, new Date('2016/09/01'));
  Logger.log(x);
}

/**
 * Returns Integer number of Games having date greater than the given date parameter.
 *
 * @return {Integer} the number of Game having date greater than the given date parameter.
 * @customfunction
 */
function getNumberOfGamesWithDateGreaterThan(firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex, date) {
  return getGamesListGreaterThanDate(firstRowIndex, lastRowIndex, firstColumnIndex, lastColumnIndex, new Date(date)).length;
}

function getAllResults() {
  return getValuesForColumn('logs', this.gameLastColumnIndex);
}

function getGameObject(date) {
  
  var arrayOfGamesWithNoHeader = underscoreGS._last(this.arrayOfGames, this.arrayOfGames.length - 1);// removing the header
  var x = arrayOfGamesWithNoHeader.filter(function(element) {
    return element.date.getTime() == new Date(date).getTime();
  });  
  return x[0];
}
function testGetGameObject() {
  var x = getGameObject('2015/08/12');
  Logger.log(x);
}


function getGameScore(date) {
  var gameObject = getGameObject(date);
  return {
    result1: gameObject.result.split('-')[0],
    result2: gameObject.result.split('-')[1]
  }
}
function testGetGameScore() {
  var x = getGameScore('2017/04/18');
  Logger.log(x);
}

function getGameTeams(date) {
  var gameObject = getGameObject(date);
  return {
    team1: [gameObject.team1, gameObject['team1-12'], gameObject['team1-13'], gameObject['team1-14'], gameObject['team1-15'], gameObject['team1-16']],
    team2: [gameObject.team2, gameObject['team2-18'], gameObject['team2-19'], gameObject['team2-20'], gameObject['team2-21'], gameObject['team2-22']]
  }
}
function testGetGameTeams() {
  var x = getGameTeams('2016/08/10');
  Logger.log(x);
}

function getPlayerTeam(date, player) {
  var gameTeams = getGameTeams(date);
  if (underscoreGS._contains(gameTeams.team1, player)) {
    return 'team1';
  } else if (underscoreGS._contains(gameTeams.team2, player)) {
    return 'team2';
  } 
  return '';
}
      
function testGetPlayerTeam() {
  var x = getPlayerTeam('2016/08/10', 'A-KAR');
  Logger.log(x);
}      

function getWinningTeam(date) {
  var scoreObject = getGameScore(date);
  if(parseInt(scoreObject.result1) > parseInt(scoreObject.result2)) {
    return 'team1';
  } else if(parseInt(scoreObject.result1) < parseInt(scoreObject.result2)){
    return 'team2';
  } else {
    return 'even';
  }
}
function testGetWinningTeam() {
  var x = getWinningTeam('2015/11/11');
  Logger.log(x);
}

function checkPlayerHasWon(date, player) {
  return getWinningTeam(date) == getPlayerTeam(date, player); 
}
function testCheckPlayerHasWon() {
  var x = checkPlayerHasWon('2015/08/12', 'W-AZZ');
  Logger.log(x);
}
function checkPlayerGameWentEven(date, player) {
  return getWinningTeam(date) == 'even' && (getPlayerTeam(date, player) == 'team1' || getPlayerTeam(date, player) == 'team2');
}
function testCheckPlayergameWentEven() {
  var x = checkPlayerGameWentEven('2015/11/11', 'W-AZZ');
  Logger.log(x);
}
function getAllGamesDates() {
  return getValuesForColumn('logs', 1);
}
function testGetAllGamesDates() {
  Logger.log(getAllGamesDates());
}

/**
 * return the number of won games for a given player
 *
 */
function countNumberOfWonGames(player) {
  //var dateList = getAllGamesDates();
  var counter = 0;
  this.listOfGamesDates.forEach(function(date){
    date.setDate(date.getDate() + 1);
    if(checkPlayerHasWon(Utilities.formatDate(date, 'GMT', 'yyyy/MM/dd'), player)) {
      counter++;
    }
  });
  return counter;
}
function testCountNumberOfWonGames() {
  var x = countNumberOfWonGames('T-KHO');
  Logger.log(x);
}
/**
 * return the number of won games for a given player
 *
 */
function countNumberOfEvenGames(player) {
  //var dateList = getAllGamesDates();
  var counter = 0;
  this.listOfGamesDates.forEach(function(date){
    date.setDate(date.getDate() + 1);
    if(checkPlayerGameWentEven(Utilities.formatDate(date, 'GMT', 'yyyy/MM/dd'), player)) {
      counter++;
    }
  });
  return counter;
}
function testCountNumberOfEvenGames() {
  var x = countNumberOfEvenGames('W-AZZ');
  Logger.log(x);
}
