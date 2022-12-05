
// Theoretical limits. For some reason Math.MAX_SAFE_INTEGER and Math.MIN_SAFE_INTEGER become undefined and don't behave properly.
var lowestDieResult = 9999;
var highestDieResult = -9999;

// Returns a random integere between min and max (inclusive of both).
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

// Updates the die stats portion of the page, given the new die value.
// The die stats keeps track of the current lowest value, the current highest value, and the difference between the two extremes.
// The difference is only printed if the extremes are different.
function updateDieStats(newDieValue) {
    const dieStats = document.getElementById('die_stats');
	if (newDieValue > highestDieResult) {
		highestDieResult = newDieValue;
	}
	if (newDieValue < lowestDieResult) {
		lowestDieResult = newDieValue;
	}
	dieStatsText = 'lowest value = ' + lowestDieResult + '; highest value = ' + highestDieResult;
	if (lowestDieResult != highestDieResult) {
      dieStatsText += '; difference = ' + Math.abs(highestDieResult - lowestDieResult);
	}
	dieStats.textContent = dieStatsText;
}

// Clears the die stats portion.
function clearDieStats() {
	document.getElementById('die_stats').textContent = '';
	lowestDieResult = 9999;
	highestDieResult = -9999;
}

// Clears the printed die results.
function clearPrintedDieResults() {
	document.getElementById('printed_die_results').textContent = '';
	clearDieStats();
}

// Appends the die roll result to the body of the page.
function appendDieRollToBody() {
  const printedDieResults = document.getElementById('printed_die_results');
  const minDieValue = parseInt(document.getElementById('min_die_value').value);
  const maxDieValue = parseInt(document.getElementById('max_die_value').value);
  
  if (minDieValue > maxDieValue) {
    const warning = document.createElement('p');
	warning.textContent = '***ERROR***: cannot do die roll with minimum die value (' + min_die_value + ') greater than maximum die value (' + maxDieValue + ').'
	warning.style.color = 'red';
    printedDieResults.appendChild(warning);
  } else {
	const rollCount = parseInt(document.getElementById('die_roll_count').value);
	for (let count = 0; count < rollCount; count++) {
      const dieResult = getRandomInt(minDieValue, maxDieValue);
      const newDieResult = document.createElement('p');
      newDieResult.textContent = '(' + minDieValue + ', ' + maxDieValue + ') = ' + dieResult;
      printedDieResults.appendChild(newDieResult);
      updateDieStats(dieResult);
	}
  }
}

// Adds functions to the buttons.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('die_roll_button').addEventListener('click', appendDieRollToBody);
  document.getElementById('clear_printed_results').addEventListener('click', clearPrintedDieResults);
});
