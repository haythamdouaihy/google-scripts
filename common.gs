
/**
 * This function is used to refresh the evaluation of data where customer functions are used.
 * As custom functions do not refresh when data has been changed somewhere in the sheets,
 * so we use this function to trigger a reevaluation
 *
 */
function onEdit(e) {
  SpreadsheetApp.getActiveSheet().getRange('!stats!H1').setValue(Math.random());
  SpreadsheetApp.getActiveSheet().getRange('!players!P1').setValue(Math.random());
}

