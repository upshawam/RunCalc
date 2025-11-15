// Unit state (true = km, false = miles)
let isKilometers = false;

// Event distances in kilometers
const eventDistancesKm = {
  '5k': 5,
  '10k': 10,
  'half_marathon': 21.0975,
  'full_marathon': 42.195,
  '50k': 50
};

// Event distances in miles
const eventDistancesMiles = {
  '5k': 3.1,
  '10k': 6.2,
  'half_marathon': 13.1,
  'full_marathon': 26.2,
  '50k': 31.1
};

// Unit radio button functionality
document.addEventListener('DOMContentLoaded', () => {
  const unitRadios = document.querySelectorAll('input[name="unit"]');
  const labels = document.querySelectorAll('.radio-label span');

  labels.forEach((label, index) => {
    label.textContent = index === 0 ? 'mi' : 'km';
  });

  unitRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      isKilometers = radio.value === 'km';
      
      // Update pace header
      const paceHeader = document.getElementById('paceHeader');
      paceHeader.textContent = isKilometers ? 'Pace (min/km)' : 'Pace (min/mi)';

      // Convert existing distance value if present
      const distanceInput = document.getElementById('distance');
      if (distanceInput.value) {
        const currentValue = parseFloat(distanceInput.value);
        distanceInput.value = isKilometers
          ? (currentValue * 1.60934).toFixed(2) // Convert miles to km
          : (currentValue / 1.60934).toFixed(2); // Convert km to miles
      }

      // Update event select if a preset is chosen
      const eventSelect = document.getElementById('eventSelect');
      if (eventSelect.value) {
        updateDistanceFromEvent();
      }
    });
  });
});

// Unit toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const unitToggle = document.getElementById('unitToggle');
  const unitLabel = document.getElementById('unitLabel');
  const paceHeader = document.getElementById('paceHeader');

  unitToggle.addEventListener('change', () => {
    isKilometers = unitToggle.checked;
    unitLabel.textContent = isKilometers ? 'km' : 'mi';

    // Update pace header
    paceHeader.textContent = isKilometers ? 'Pace (min/km)' : 'Pace (min/mi)';

    // Convert existing distance value if present
    const distanceInput = document.getElementById('distance');
    if (distanceInput.value) {
      const currentValue = parseFloat(distanceInput.value);
      distanceInput.value = isKilometers
        ? (Math.round(currentValue * 1.60934 * 100) / 100).toFixed(2) // Convert miles to km
        : (Math.round(currentValue / 1.60934 * 100) / 100).toFixed(2); // Convert km to miles
    }

    // Convert existing pace value if present
    const paceMinutesInput = document.getElementById('paceMinutes');
    const paceSecondsInput = document.getElementById('paceSeconds');
    if (paceMinutesInput.value || paceSecondsInput.value) {
      const paceMinutes = parseFloat(paceMinutesInput.value) || 0;
      const paceSeconds = parseFloat(paceSecondsInput.value) || 0;
      const totalPaceInSeconds = (paceMinutes * 60) + paceSeconds;

      const convertedPaceInSeconds = isKilometers
        ? Math.round(totalPaceInSeconds / 1.60934) // Convert pace to km
        : Math.round(totalPaceInSeconds * 1.60934); // Convert pace to miles

      const newPaceMinutes = Math.floor(convertedPaceInSeconds / 60);
      const newPaceSeconds = Math.round(convertedPaceInSeconds % 60);

      paceMinutesInput.value = newPaceMinutes;
      paceSecondsInput.value = newPaceSeconds;
    }

    // Update event select if a preset is chosen
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect.value) {
      updateDistanceFromEvent();
    }
  });
});

// Update distance field when selecting a race event
function updateDistanceFromEvent() {
  const event = document.getElementById('eventSelect').value;
  const distanceInput = document.getElementById('distance');

  if (!event) {
    distanceInput.value = '';
    return;
  }

  const distances = isKilometers ? eventDistancesKm : eventDistancesMiles;
  distanceInput.value = distances[event] || '';
}

document.getElementById('eventSelect').addEventListener('change', updateDistanceFromEvent);

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
