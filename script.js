/* global google */
const display = document.querySelector("p"),
      dataSheetLink = document.querySelector("#dataSheetLink"),
      run = google.script.run
        .withFailureHandler(handleError)
          .withSuccessHandler(start)
let words,
    wordIndex

// call server
run.getWords()

// register event handlers
window.addEventListener("click", handleClick)
window.addEventListener("keydown", handleKeydown)
google.script.history.setChangeHandler(handleHistory)

// end script; begin function definitions


/** helper function to clear out the section select element */
function empty(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild)
  }
}

function fill(el, object, value) {
  if (value) {
    object = object[value]
  }
  for (let number in object) {
    const option = document.createElement("option")
    option.textContent = option.value = number
    el.appendChild(option)
  }
}


/** handles clicking on the card */
function handleClick(click) {
  if (click.target.tagname != "P") {
    return
  }
  nextWord()
}

// simple display of error to the user
function handleError(error) {
  display.textContent = error.message
}

function handleHistory(change) {
  // TODO implement handleHistory
  if (! change.state) {
    return
  }
}

function handleKeydown(keydown) {
  if (keydown.key == " ") {
    // TODO implment handleKeydown
  }
}

function nextWord() {
  ++wordIndex
  if (wordIndex == words.length) {
    shuffle(words)
    wordIndex = 0
  }
  updateWord(words[wordIndex])
  google.script.history.push({wordIndex})
}

/**
 * Goes through deck once, swapping the ith card with a randomly
 *   selected card.
 * Mutates the array in place.
 * @param {object[]} cards
 * @returns {void}
 */
function shuffle(words) {
  for (let i = 0, l = words.length; i < l; ++i) {
    let swapIndex = Math.floor(Math.random() * words.length)
    let swapValue = words[swapIndex]
    words[swapIndex] = words[i]
    words[i] = swapValue
  }
}

/**
 * callback function; initializes app
 * @see google.script.run
 * @param {object} response - response from server
 */
function start(response) {
  words = response.cards
  dataSheetLink.setAttribute("href", response.url)
  wordIndex = 0
  shuffle(words)
  updateWord(words[wordIndex])
  google.script.history.push({wordIndex})
}

/** helper function to abstract the details of rendering each card */
function updateWord(word) {
  display.textContent = word
}
