// Automatically update the distance field when selecting a race event
document.getElementById('eventSelect').addEventListener('change', () => {
  const event = document.getElementById('eventSelect').value;
  const distanceInput = document.getElementById('distance');

  switch (event) {
    case '5k': distanceInput.value = 3.1; break;
    case '10k': distanceInput.value = 6.2; break;
    case 'half_marathon': distanceInput.value = 13.1; break;
    case 'full_marathon': distanceInput.value = 26.2; break;
    case '50k': distanceInput.value = 31.1; break;
    default: distanceInput.value = '';
  }
});

// Time Calculation
function calculateTime() {
  const paceMinutes = parseInt(document.getElementById('paceMinutes').value) || 0;
  const paceSeconds = parseInt(document.getElementById('paceSeconds').value) || 0;
  const distance = parseFloat(document.getElementById('distance').value) || 0;

  if (distance === 0) {
    alert("Please enter a valid distance.");
    return;
  }

  const totalPaceInSeconds = (paceMinutes * 60) + paceSeconds;
  if (totalPaceInSeconds === 0) {
    alert("Please enter a valid pace.");
    return;
  }

  const totalTimeInSeconds = totalPaceInSeconds * distance;

  const hours = Math.floor(totalTimeInSeconds / 3600);
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
  const seconds = Math.floor(totalTimeInSeconds % 60);

  // Display result back in the time input fields
  document.getElementById('hours').value = hours;
  document.getElementById('minutes').value = minutes;
  document.getElementById('seconds').value = seconds;
}

// Distance Calculation
function calculateDistance() {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  const paceMinutes = parseInt(document.getElementById('paceMinutes').value) || 0;
  const paceSeconds = parseInt(document.getElementById('paceSeconds').value) || 0;

  const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const totalPaceInSeconds = (paceMinutes * 60) + paceSeconds;

  if (totalPaceInSeconds === 0) {
    alert("Please enter a valid pace.");
    return;
  }

  const distance = totalTimeInSeconds / totalPaceInSeconds;

  // Display result back in the distance input field
  document.getElementById('distance').value = distance.toFixed(2);
}

// Pace Calculation (no pace hours input anymore)
function calculatePace() {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  const distance = parseFloat(document.getElementById('distance').value) || 0;

  if (distance === 0) {
    alert("Please enter a valid distance.");
    return;
  }

  // Calculate total time in seconds
  const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

  // Calculate pace in seconds per mile
  const paceInSeconds = totalTimeInSeconds / distance;

  // Since we removed the pace hours input, convert the pace to minutes and seconds.
  // This will allow paceMinutes to be >= 60 if the calculated pace is very slow.
  const paceTotalMinutes = Math.floor(paceInSeconds / 60);
  const paceSeconds = Math.floor(paceInSeconds % 60);

  // Display result back in the pace input fields
  document.getElementById('paceMinutes').value = paceTotalMinutes;
  document.getElementById('paceSeconds').value = paceSeconds;

  // Informative message if pace exceeds an hour per mile (very slow/unusual)
  const paceHours = Math.floor(paceInSeconds / 3600);
  const paceResultElem = document.getElementById('paceResult');
  if (paceHours >= 1) {
    paceResultElem.textContent = `Note: calculated pace is ${paceHours}h ${paceTotalMinutes % 60}m ${paceSeconds}s per mile. Minutes field shows total minutes (${paceTotalMinutes}m).`;
  } else {
    paceResultElem.textContent = '';
  }
}

// Clear All Function
function clearAll() {
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  const eventSelect = document.getElementById('eventSelect');
  eventSelect.selectedIndex = 0;   // Reset dropdown to "Pick Event"

  // Clear any result text
  const paceResultElem = document.getElementById('paceResult');
  if (paceResultElem) paceResultElem.textContent = '';
  const timeResultElem = document.getElementById('timeResult');
  if (timeResultElem) timeResultElem.textContent = '';
  const distanceResultElem = document.getElementById('distanceResult');
  if (distanceResultElem) distanceResultElem.textContent = '';
}
