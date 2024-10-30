// Check unlocked levels from localStorage
function loadUnlockedLevels() {
  const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
  
  // Update each button's state based on unlocked levels
  for (let i = 1; i <= unlockedLevels.length; i++) {
    const btn = document.getElementById(`btn-level-${i}`);
    if (btn) {
      btn.classList.remove('locked');
    }
  }
}

// Unlock the next level and save progress
function unlockNextLevel(currentLevel) {
  const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];

  // Check if the next level is already unlocked
  if (!unlockedLevels.includes(currentLevel + 1)) {
    unlockedLevels.push(currentLevel + 1);
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }
}

// Start level function (only works if the level is unlocked)
function startLevel(level) {
  const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
  
  if (unlockedLevels.includes(level)) {
    window.location.href = `lvl${level}.html`;
  } else {
  }
}

// Run on page load to display unlocked levels
loadUnlockedLevels();
