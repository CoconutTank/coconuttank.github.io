
// Global constants. For some reason Math.MAX_SAFE_INTEGER and Math.MIN_SAFE_INTEGER become undefined and don't behave properly.
const INITIAL_LOWEST_DIE_VALUE = 9999;
const INITIAL_HIGHEST_DIE_VALUE = -9999;
const DIE_PARAM_SPLIT = ',';
const DIE_POOL_SPLIT = ';';
const INDIVIDUAL_ROLL_SPLIT = ' / ';
const GROUP_ROLL_SPLIT = ' ~ ';

// Global variables.
var lowestDieResult = INITIAL_LOWEST_DIE_VALUE;
var highestDieResult = INITIAL_HIGHEST_DIE_VALUE;
var dieSum = 0;
var diePool = [];

// Validates the given die parameters, and shows an alert for each failure if desired.
function areValidDieParams(min, max, showAlerts) {
  var valid = true;
  var alertMsgs = [];
  if (Number.isNaN(min)) {
	valid = false;
	alertMsgs.push('***ERROR***: given minimum die value is NaN.');
  }
  if (Number.isNaN(max)) {
	valid = false;
	alertMsgs.push('***ERROR***: given maximum die value is NaN.');
  }
  if (min < 1) {
	valid = false;
	alertMsgs.push('***ERROR***: invalid die parameters with minimum die value (' + min + ') less than 1.');
  }
  if (min >= max) {
	valid = false;
	alertMsgs.push('***ERROR***: invalid die parameters with minimum die value (' + min + ') greater than or equal to maximum die value (' + max + ').');
  }
  if (!valid && showAlerts) {
	for (const alertMsg of alertMsgs) {
	  alert(alertMsg);
	}
  }
  return valid;
}

// Returns a random integer between min and max (inclusive of both).
function getRandomInt(min, max) {
  min = Math.floor(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

// Removes all die currently in the die pool.
// This function is used with the "Clear Die Pool" button.
function clearDiePool() {
  diePool = [];
  document.getElementById('die_pool').textContent = '';
  document.getElementById('roll_die_pool_button').disabled = true;
  document.getElementById('clear_die_pool_button').disabled = true;
}

// Adds a die to the die pool with the given parameters.
// The first value is always treated as the minimum value, and the second value is always treated as the maximum value.
// All integer values are possible with the given die, inclusive of the min and max values.
function addDieToDiePoolInner(min, max) {
  diePool.push([min, max]);
  var diePoolObject = document.getElementById('die_pool');
  var diePoolText = diePoolObject.textContent;
  if (diePool.length >= 2) {
	  diePoolText += DIE_POOL_SPLIT;
  }
  diePoolText += (min + DIE_PARAM_SPLIT + max);
  diePoolObject.textContent = diePoolText;
  document.getElementById('roll_die_pool_button').disabled = false;
  document.getElementById('clear_die_pool_button').disabled = false;
}

// Outer method for adding a die to the die pool.
// This function is used with the "Add Die to Die Pool" button.
function addDieToDiePool() {
  min = Math.floor(parseInt(document.getElementById('min_die_value').value));
  max = Math.floor(parseInt(document.getElementById('max_die_value').value));
  if (areValidDieParams(min, max, true)) {
	addDieToDiePoolInner(min, max);
  }
}

// Clears the existing die pool, then loads a die pool from the given die pool string.
// The expected format is a list of die parameter pairs, concatenated together with a ';' between each die parameter pair. 
// Each expected die parameter pair is an integer, concatenated together with a ',' inbetween.
// The last character of the die pool string must be an integer.
// No other characters are expected.
// The string that shows up for the die pool when adding die to the die pool should be a valid input.
// This function is used with the "Load Die Pool" button.
function loadDiePool() {
  diePoolInput = document.getElementById('die_pool_input').value;
  if (diePoolInput.length > 0) {
    clearDiePool();
    const diePoolInputSplit = diePoolInput.split(DIE_POOL_SPLIT);
    for (const dieParams of diePoolInputSplit) {
	  die = dieParams.split(DIE_PARAM_SPLIT);
	  if (die.length == 2) {
	    min = parseInt(die[0]);
	    max = parseInt(die[1]);
	    if (areValidDieParams(min, max, true)) {
	      addDieToDiePoolInner(min, max);
	    }
	  } else {
		alert('***ERROR***: Malformed die pair detected. Given die pair = ' + die);
	  }
    }
  } else {
	alert('***ERROR***: invalid die pool input; die pool input cannot be empty.');
  }
}

// Clears the die stats portion.
// This function is used with the "Clear Die Results" button.
function clearDieStats() {
  document.getElementById('die_stats').textContent = '';
  lowestDieResult = 9999;
  highestDieResult = INITIAL_HIGHEST_DIE_VALUE;
  dieSum = 0;
  document.getElementById('clear_printed_results').disabled = true;
}

// Updates the die stats portion of the page, given the new die value.
// The die stats keeps track of the current lowest value, the current highest value, and the difference between the two extremes.
// The difference is only printed if the extremes are different.
function updateDieStats(newDieValue) {
  const dieStats = document.getElementById('die_stats');
  dieStats.textContent = '';
  if (newDieValue > highestDieResult) {
	highestDieResult = newDieValue;
  }
  if (newDieValue < lowestDieResult) {
	lowestDieResult = newDieValue;
  }
  dieSum += newDieValue;
  const lowestValueLine = document.createElement('div');
  const highestValueLine = document.createElement('div');
  const totalSumLine = document.createElement('div');
  lowestValueLine.textContent = 'Lowest rolled value = ' + lowestDieResult;
  highestValueLine.textContent = 'Highest rolled value = ' + highestDieResult;
  totalSumLine.textContent = 'Total die sum = ' + dieSum;
  dieStats.appendChild(lowestValueLine);
  dieStats.appendChild(highestValueLine);
  dieStats.appendChild(totalSumLine);
  if (lowestDieResult != highestDieResult) {
    const diffLine = document.createElement('div');
	diffLine.textContent = 'Difference between highest and lowest die rolls = ' + Math.abs(highestDieResult - lowestDieResult);
	dieStats.appendChild(diffLine);
  }
  document.getElementById('clear_printed_results').disabled = false;
}

// Clears the printed die results.
function clearPrintedDieResults() {
	document.getElementById('printed_die_results').textContent = '';
	clearDieStats();
}

// Rolls all the die in the die pool and displays the results.
// This function is used with the "Roll!" button.
function rollDiePoolAndDisplayResults() {
  const printedDieResults = document.getElementById('printed_die_results');
  var printedDieResultsText = printedDieResults.textContent;
  if (printedDieResultsText.length > 0) {
	printedDieResultsText += GROUP_ROLL_SPLIT;
  }
  var newPrintedResults = '';
  for (const die of diePool) {
    const min = die[0];
    const max = die[1];
    const dieResult = getRandomInt(min, max);
    updateDieStats(dieResult);
	if (newPrintedResults.length > 0) {
		newPrintedResults += INDIVIDUAL_ROLL_SPLIT;
	}
	newPrintedResults += dieResult;
  }
  printedDieResults.textContent = (printedDieResultsText + newPrintedResults);
}

// Enables (or disables) the "Load Die Pool" button, depending on whether or not it has any input.
// This function is used with the "Die Pool Input" input field.
function toggleLoadDiePoolButton() {
  const diePoolInputValue = document.getElementById('die_pool_input').value;
  if (diePoolInputValue != "") {
	document.getElementById('load_die_pool_button').removeAttribute('disabled');
  } else {
	document.getElementById('load_die_pool_button').setAttribute('disabled', true);
  }
}

// Adds functions to the buttons.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add_die_button').addEventListener('click', addDieToDiePool);
  document.getElementById('roll_die_pool_button').addEventListener('click', rollDiePoolAndDisplayResults);
  document.getElementById('clear_die_pool_button').addEventListener('click', clearDiePool);
  document.getElementById('die_pool_input').addEventListener('keyup', toggleLoadDiePoolButton);
  document.getElementById('load_die_pool_button').addEventListener('click', loadDiePool);
  document.getElementById('clear_printed_results').addEventListener('click', clearPrintedDieResults);
});
