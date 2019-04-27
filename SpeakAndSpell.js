/* exported
    doGet 
    getWords
    include_
*/
var defaults = {
  SPREADSHEET_NAME: "Speak and Spell", // register preferred name here
  SPREADSHEET_ID: "sheetId", // avoids bugs from string based key
  SHEET_URL: "sheetUrl", // avoids bugs from string based key
  headings: { // register the order of the spreadsheet columns here
    WORD: 0
  }
}

/**
 * HTTP GET handler
 * this is the starting point of the web app
 * the request parameter is not currently used
 */
function doGet(/*request*/) {
  var template = HtmlService.createTemplateFromFile('index')
  var html = template.evaluate()
  html.setTitle('Speak and Spell')
    .addMetaTag("viewport", "width=device-width")
  return html
}

/**
 * getWords maps the sheet data to objects
 * public function called by client after doGet
 * @returns {string[]}
 */
function getWords() {
  var sheet = getSheet_()
  var values = sheet.getDataRange().getValues()
  values.shift()
  var words = []
  if (values.length == 0) { // no words to get
      words = getDefaultWords_() // display default
  } else {
    values.forEach(function (row) {
      words.push(row[defaults.headings.WORD])
    })
  }
  return {
    words: words,
    url: getUrl_()
  }
}

/**
 * getDefaultWords_
 * @returns {string[]}
 */
function getDefaultWords_() {
  return ["cat","dog","me"]
}

/**
 * getSheet_ will open or create the default data sheet
 * if the id is set but does not return a sheet, a new spreadsheet
 * will be created.
 * @returns {Sheet} the user's default data sheet
 */
function getSheet_() {
  var id = PropertiesService.getUserProperties()
    .getProperty(defaults.SHEET_ID)
  if (! id) {
    return newSpreadsheet_().getSheets()[0]
  }
  try {
    return SpreadsheetApp.openById(id).getSheets()[0]
  } catch (error) { // maybe it was deleted? newSpreadsheet resets property
    return newSpreadsheet_().getSheets()[0]
  }
}

/**
 * getUrl_ is a helper function
 * @returns {string} - url of the data sheeet
 */
function getUrl_() {
  return PropertiesService.getUserProperties()
    .getProperty(defaults.SHEET_URL)
}

/**
 * templating helper function for modularizing HTML, CSS, and JavaScript
 */
function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/**
 * newSpreadsheet_ creates a new data spreadsheet to hold the word data
 * mutates (sets/overwrites) the user's properties for SHEET_ID and SHEET_URL
 * @returns {Spreadsheet}
 */
function newSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.create(defaults.SPREADSHEET_NAME)
  var userProperties = PropertiesService.getUserProperties()
  userProperties.setProperty(defaults.SHEET_ID, spreadsheet.getId())
  userProperties.setProperty(defaults.SHEET_URL, spreadsheet.getUrl())
  var sheet = spreadsheet.getSheets()[0]
  var headerRow = []
  var h = defaults.headings
  headerRow[h.WORD] = "Word"
  sheet.appendRow(headerRow)
  sheet.setFrozenRows(1) 
  return spreadsheet
}
