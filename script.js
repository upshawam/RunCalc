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

/**
 * Input sanitization helpers to prevent 'e' (and 'E') being used in number inputs.
 * Browsers allow 'e' in <input type="number"> to type scientific notation (e.g., 1e3).
 * Users can accidentally enter 'e' which can lead to confusing behavior.
 *
 * Strategy:
 * - Prevent keydown for 'e' and 'E'
 * - Prevent paste if pasted content contains 'e' or 'E'
 * - On input, remove any 'e' or 'E' characters that sneak in
 */
function preventExpKey(e) {
  // Allow: digits, Backspace, Tab, Arrow keys, Delete, Home, End, Enter, '.', and '-'
  // Block 'e' and 'E'
  if (e.key === 'e' || e.key === 'E') {
    e.preventDefault();
  }
}

function preventPasteWithE(e) {
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  if (/[eE]/.test(paste)) {
    e.preventDefault();
    // Optionally, clean paste and insert sanitized form:
    const cleaned = paste.replace(/[eE]/g, '');
    const target = e.target;
    // Insert cleaned text at cursor position if possible
    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, cleaned);
    } else {
      // Fallback: append cleaned value
      target.value = (target.value || '') + cleaned;
    }
  }
}

function sanitizeInputValue(e) {
  const el = e.target;
  // Remove any 'e' or 'E' characters that might exist, and trim spaces
  if (typeof el.value === 'string' && /[eE]/.test(el.value)) {
    el.value = el.value.replace(/[eE]/g, '');
  }
}

// Attach these handlers to all inputs that accept numbers
document.addEventListener('DOMContentLoaded', () => {
  const numInputs = document.querySelectorAll('input.num-input[type="number"]');
  numInputs.forEach(input => {
    input.addEventListener('keydown', preventExpKey);
    input.addEventListener('paste', preventPasteWithE);
    input.addEventListener('input', sanitizeInputValue);
    // Use inputmode and pattern to hint mobile keyboards
    input.setAttribute('inputmode', 'decimal');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
  });
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

  // Convert to minutes and seconds. minutes may be >= 60 for very slow paces.
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
