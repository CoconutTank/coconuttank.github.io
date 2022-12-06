
// Theoretical limits. For some reason Math.MAX_SAFE_INTEGER and Math.MIN_SAFE_INTEGER become undefined and don't behave properly.
var lowestDieResult = 9999;
var highestDieResult = -9999;
var dieSum = 0;
var diePool = [];

// Validates the given die parameters, and shows an alert for each failure if desired.
function areValidDieParams(min, max, showAlerts) {
  var valid = true;
  var alertMsgs = [];
  if (min < 1) {
	valid = false;
	alertMsgs.push('***ERROR***: invalid die parameters with minimum die value (' + min + ') being less than 1.');
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
	  diePoolText += ';';
  }
  diePoolText += (min + ',' + max);
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
  clearDiePool();
  diePoolInput = document.getElementById('die_pool_input').value;
  console.log('diePoolInput = ' + diePoolInput);
  const diePoolInputSplit = diePoolInput.split(';');
  console.log('diePoolInputSplit = ' + diePoolInputSplit);
  for (const dieParams of diePoolInputSplit) {
	die = dieParams.split(',');
    console.log('die = ' + die);
	min = parseInt(die[0]);
	max = parseInt(die[1]);
	if (areValidDieParams(min, max, true)) {
	  addDieToDiePoolInner(min, max);
	}
  }
}

// Clears the die stats portion.
// This function is used with the "Clear Die Results" button.
function clearDieStats() {
	document.getElementById('die_stats').textContent = '';
	lowestDieResult = 9999;
	highestDieResult = -9999;
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
  lowestValueLine.textContent = 'lowest value = ' + lowestDieResult;
  highestValueLine.textContent = 'highest value = ' + highestDieResult;
  totalSumLine.textContent = 'total die sum = ' + dieSum;
  dieStats.appendChild(lowestValueLine);
  dieStats.appendChild(highestValueLine);
  dieStats.appendChild(totalSumLine);
  if (lowestDieResult != highestDieResult) {
    const diffLine = document.createElement('div');
	diffLine.textContent = 'difference between highest and lowest die rolls = ' + Math.abs(highestDieResult - lowestDieResult);
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
function rollDiePoolAndDisplayResults() {
  const printedDieResults = document.getElementById('printed_die_results');
  for (const die of diePool) {
    const min = die[0];
    const max = die[1];
    const dieResult = getRandomInt(min, max);
    const newDieResult = document.createElement('div');
    newDieResult.textContent = '(' + min + ', ' + max + ') = ' + dieResult;
    printedDieResults.appendChild(newDieResult);
    updateDieStats(dieResult);
  }
}

// Adds functions to the buttons.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add_die_button').addEventListener('click', addDieToDiePool);
  document.getElementById('roll_die_pool_button').addEventListener('click', rollDiePoolAndDisplayResults);
  document.getElementById('clear_die_pool_button').addEventListener('click', clearDiePool);
  document.getElementById('load_die_pool_button').addEventListener('click', loadDiePool);
  document.getElementById('clear_printed_results').addEventListener('click', clearPrintedDieResults);
});
