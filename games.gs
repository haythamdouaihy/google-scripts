var cache = CacheService.getScriptCache();

var gameFirstRowIndex = 1;
var gameLastRowIndex = 200;
var gameFirstColumnIndex = 1;
var gameLastColumnIndex = 24;

var listOfGamesDates = getAllGamesDates();
var totalNumberOfGames = listOfGamesDates.length + 1;
//var arrayOfGames = getListOfGames();
var arrayOfGames = rangeToListOfObjects('logs', 1, totalNumberOfGames, 1, gameLastColumnIndex);
//var listOfPlayers = getListOfPlayers();
var listOfPlayers = getPlayersAbbvrList(3);
var playersStats = getPlayersStats();
var playersGeneralStats = getPlayersGeneralStats();

function getListOfGames() {
  //cache = CacheService.getScriptCache();
  var listOfGames = this.cache.get("listOfGames");
  if(listOfGames != null) {
    listOfGames = JSON.parse(listOfGames);
    return listOfGames;
  }
  
  listOfGames = rangeToListOfObjects('logs', 1, totalNumberOfGames, 1, gameLastColumnIndex);
  this.cache.put("listOfGames", JSON.stringify(listOfGames), 1500);
  return listOfGames;
}

function testGetListOfGames() {
  var x = getListOfGames();
  Logger.log(x);
}

function getListOfPlayers() {
  var listOfPlayers = this.cache.get("listOfPlayers");
  if(listOfPlayers != null) {
    return listOfPlayers.split(",");    
  }
  
  listOfPlayers = getPlayersAbbvrList(3);
  this.cache.put("listOfPlayers", listOfPlayers, 1500);
  return listOfPlayers;
}

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
  var x = getGameObject('2015-08-11T21:00:00.000Z');
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
function checkPlayerGameWentEven(date) {
  return getWinningTeam(date) == 'even';
}
function testCheckPlayergameWentEven() {
  var x = checkPlayerGameWentEven('2015/11/11');
  Logger.log(x);
}
function getAllGamesDates() {
  //cache.remove("datesColumn");
  var datesColumn = this.cache.get("datesColumn");

  if(datesColumn != null) {
    return datesColumn.split(",");
  }
  datesColumn = getValuesForColumn('logs', 1);
  datesColumn = underscoreGS._map(datesColumn, function(date){
    date.setDate(date.getDate() + 1);
    return Utilities.formatDate(date, 'GMT', 'yyyy/MM/dd');    
  });
  this.cache.put("datesColumn", datesColumn, 1500);
  return datesColumn;
  //return getValuesForColumn('logs', 1);
}
function testGetAllGamesDates() {
  var x = getAllGamesDates();
  Logger.log(x);
}

/**
 * return the number of won games for a given player
 *
 */
function countNumberOfWonGames(player) {
  var counter = 0;
  this.listOfGamesDates.forEach(function(date) {
    if(checkPlayerHasWon(date, player)) {
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
  var counter = 0;
  this.listOfGamesDates.forEach(function(date) {
    if(getPlayerTeam(date, player) != '' && checkPlayerGameWentEven(date)) {
      counter++;
    }
  });
  return counter;
}
function testCountNumberOfEvenGames() {
  var x = countNumberOfEvenGames('W-AZZ');
  Logger.log(x);
}
function countNumberOfLostGames(player) {
  var counter = 0;
  this.listOfGamesDates.forEach(function(date) {
    if(getPlayerTeam(date, player) != '' && !checkPlayerHasWon(date, player) && !checkPlayerGameWentEven(date)) {      
      counter++;
    }
  });
  return counter;
}
function testCountNumberOfLostGames() {
  var x = countNumberOfLostGames('T-KHO');
  Logger.log(x);
}

function getPlayersStats() {
  
  //cache.remove("playersStats");
  var playersStats = this.cache.get("playersStats");
  
  if(playersStats != null) {
    playersStats = JSON.parse(playersStats);
    //Logger.log(playersStats);
    return playersStats;
  }
  
  /*var players = ['T-KHO', 'H-DOU'];*/
  var playerTeam = '';
  var playerAgainstTeam = '';
  var result = 0; /* 0: even, 1:won, -1: lost */
  var mates = [];
  var globMates = [];/* x = [{player: '', count: 0}, {player2: '', count: 0}]*/
  var againsts = [];
  var globAgainst = [];
  var teams = [];
  var stat = [];
  var index;
  var playerObj;
  var all = [];
  var date;
  
  this.listOfPlayers.forEach(function(player) {  
    this.listOfGamesDates.forEach(function(d){
      //date = new Date(d);
      //date.setDate(date.getDate()+1);
      // if player is playing this game
      playerTeam = getPlayerTeam(d, player);
      if( playerTeam != '') {
        // check game result
        if(checkPlayerHasWon(d, player)) {
          result = 1;
        } else if (checkPlayerGameWentEven(d)) {
          result = 0;
        } else {
          result = -1;
        }
        
        teams = getGameTeams(d);
        mates = underscoreGS._reject(teams[playerTeam], function(p) { 
          return (p == player || p == ''); 
        });
        
        // for each mate, add or increment its occurence in globalMates
        mates.forEach(function(mate){
          // check if this mate already exist in global mates
          playerObj = underscoreGS._filter(globMates, function(m) {
            return m.player == mate;
          });
          
          if(playerObj != undefined && playerObj != '') {
            index = underscoreGS._lastIndexOf(globMates, playerObj[0]);
            if(index != -1) {
              globMates[index].count ++;
              if(result == 1) {
                globMates[index].won ++;
              } else if(result == 0) {
                globMates[index].even ++;
              } else {
                globMates[index].loose ++;
              }
            }         
          } else {
            if(result == 1) {
              globMates.push({player: mate, count: 1, won: 1, even: 0, loose: 0});
            } else if(result == 0) {
              globMates.push({player: mate, count: 1, won: 0, even: 1, loose: 0});
            } else {
              globMates.push({player: mate, count: 1, won: 0, even: 0, loose: 1});
            }            
          }
        });        
        
        playerAgainstTeam = underscoreGS._reject(underscoreGS._keys(teams), function(team) { 
          return (team == playerTeam); 
        });
        againsts = underscoreGS._reject(teams[playerAgainstTeam], function(p) { 
          return (p == ''); 
        });
        
        againsts.forEach(function(against){
          playerObj = underscoreGS._filter(globAgainst, function(a){
            return a.player == against;
          });
          
          if(playerObj != undefined && playerObj != '') {
            index = underscoreGS._lastIndexOf(globAgainst, playerObj[0]);
            if(index != -1) {
              globAgainst[index].count++;
              if(result == 1) {
                globAgainst[index].won ++;
              } else if(result == 0) {
                globAgainst[index].even ++;
              } else {                                
                globAgainst[index].loose ++;
              }
            } 
          } else { 
            if(result == 1) {
              globAgainst.push({player: against, count: 1, won: 1, even: 0, loose: 0});
            } else if(result == 0) {
              globAgainst.push({player: against, count: 1, won: 0, even: 1, loose: 0});
            } else {
              globAgainst.push({player: against, count: 1, won: 0, even: 0, loose: 1});
            }
          }
        });
        
      }
    });
    globMates = underscoreGS._sortBy(globMates, function(a) {
      return a.count;
    });
    globAgainst = underscoreGS._sortBy(globAgainst, function(a) {
      return a.count;
    });
    all.push({pp: player, mm: globMates, aa: globAgainst});    
    globMates = [];
    globAgainst = [];
  });
  //Logger.log(all);
  this.cache.put("playersStats", JSON.stringify(all), 1500);
  return all;  
}

function getColleagueStatByRank(player, rank, desc) {
  var x,y,z;
  x = playersStats.filter(function(r){
    return r.pp == player;
  })[0];
  if(desc) {
    y = x.mm[x.mm.length-rank];  
  } else {
    y = x.mm[rank-1];
  }
  
  z = y.player + '--' + y.count + '--' + y.won + '--' + y.even + '--' + y.loose;
  Logger.log(z);
  return z;
}

function getOpponentStatByRank(player, rank, desc) {
  var x,y,z;
  x = playersStats.filter(function(r){
    return r.pp == player;
  })[0];
  if(desc) {
    y = x.aa[x.aa.length-rank];  
  } else {
    y = x.aa[rank-1];
  }
  
  z = y.player + '--' + y.count + '--' + y.won + '--' + y.even + '--' + y.loose;
  Logger.log(z);
  return z;
}
function testGetColleagueStatByRank() {
  getColleagueStatByRank('T-KHO', 1, true)
}
function testGetOpponentStatByRank() {
  getOpponentStatByRank('T-KHO', 1, true)
}

function getPlayersGeneralStats() {
  
  //cache.remove("playersGeneralStats");
  var playersGeneralStats = this.cache.get("playersGeneralStats");
  
  if(playersGeneralStats != null) {
    playersGeneralStats = JSON.parse(playersGeneralStats);
    return playersGeneralStats;
  }
  
  var playerTeam = '';
  var gameScore = {};
  var winningTeam = '';
  var score = 0;
  var results = [];
  var all = [];
  
  this.listOfPlayers.forEach(function(player) {  
    this.listOfGamesDates.forEach(function(d){
      
      // if player is playing this game
      playerTeam = getPlayerTeam(d, player);
      if( playerTeam != '') {
        
        gameScore = getGameScore(d);
        winningTeam = getWinningTeam(d);
        
        if(winningTeam == 'even') {
          score = 0;
        } else if(winningTeam == 'team1' && playerTeam == 'team1') {
          score = parseInt(gameScore.result1);
        } else if(winningTeam == 'team1' && playerTeam == 'team2') {
          score = parseInt(gameScore.result1) * -1;
        } else if(winningTeam == 'team2' && playerTeam == 'team1') {
          score = parseInt(gameScore.result2) * -1;
        } else if(winningTeam == 'team2' && playerTeam == 'team2') {
          score = parseInt(gameScore.result2);
        }
                
        results.push({date: d, score: score}); 
      }
      
    });
        
    all.push({pp: player, rr: results});    
    results = [];

  });
  
  //Logger.log(all);
  this.cache.put("playersGeneralStats", JSON.stringify(all), 1500);
  //JSON.
  return all;  
}

function getPlayerScores(player) {
  var playerStats, scores;
  playerStats = playersGeneralStats.filter(function(r){
    return r.pp == player;
  })[0];
  
  scores = underscoreGS._map(playerStats.rr, function(stat){    
    return stat.score;    
  });
  
  Logger.log(scores);
  return scores;
}
function testGetPlayerScores() {
  getPlayerScores('T-KHO');
}