 window.addEventListener('load', async function () {
  let playerCount = 0;
  let playerRecord = parseInt(localStorage.getItem("playerRecord")) || 21334520;
  
  const sheet = document.styleSheets[0]; // First stylesheet
  const experienceId = "7436755782";
  const url = `https://games.roproxy.com/v1/games?universeIds=${experienceId}`;

  function updatePlayerCount(number) {
    const digitsOnly = number.toString().padStart(8, '0');
    const digitWrappers = document.querySelectorAll('#playerCount .digit-wrapper');

    digitsOnly.split('').forEach((digit, i) => {
      const wrapper = digitWrappers[i];
      const offset = parseInt(digit) * -2.5;
      wrapper.style.transform = `translateY(${offset}rem)`;

      if (i === 0) {
        const outerDigitSpan = wrapper.parentElement;
        if (digit === '0') {
          outerDigitSpan.style.display = 'none';
        } else {
          outerDigitSpan.style.display = '';
        }
      }
    });
  }

  const possibleTimerTQuotes = [
    "Time left of functional Roblox Servers:",
    "Time left of Roblox online:",
    "Time left until disaster strikes:",
    "Time left until Grow a Garden updates:",
    "Time left until Roblox dies:"
  ];

  const randomQuote = possibleTimerTQuotes[Math.floor(Math.random() * possibleTimerTQuotes.length)];

  let lastPlayerCount = 0
  let increment = 0

  function odometerColor(id) {
    for (let rule of sheet.cssRules) {
      if (rule.selectorText === ".odometer-player") {
        if (id === 1) {
          rule.style.color = "#ffff00"
        } else {
          rule.style.color = "#ffffff"
        }
        break;
      }
    }
  }

 async function getPlayerCount() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const count = data.data[0]?.playing ?? 0;
    if (lastPlayerCount != 0) {
      increment = count - lastPlayerCount;
    }
    lastPlayerCount = count;
    updatePlayerCount(count);
    odometerColor(0);
    playerCount = count;
   
   if (playerCount > playerRecord) {
     playerRecord = playerCount;
     localStorage.setItem("playerRecord", playerRecord.toString());
     document.getElementById("prCount").textContent = `${playerCount.toLocaleString()} Players`;
   }
   
  } catch (error) {
    const fallbackCount = lastPlayerCount + increment;
    updatePlayerCount(fallbackCount);
    lastPlayerCount += increment;
    odometerColor(1);
    playerCount = fallbackCount;
   
    if (playerCount > playerRecord) {
      playerRecord = playerCount;
      localStorage.setItem("playerRecord", playerRecord.toString());
      document.getElementById("prCount").textContent = `${playerCount.toLocaleString()} Players`;
    }
  }
}

  function updateCountdown() {
    const now = new Date();
    const day = now.getUTCDay();
    const daysUntilSaturday = (6 - day + 7) % 7;

    const target = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilSaturday,
      14, 0, 0 // 14:00 UTC
    ));

    if (target <= now) {
      target.setUTCDate(target.getUTCDate() + 7);
    }

    const diff = target - now;
    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    document.getElementById("timer").textContent =
      `${String(d).padStart(2, '0')}:` +
      `${String(h).padStart(2, '0')}:` +
      `${String(m).padStart(2, '0')}:` +
      `${String(s).padStart(2, '0')}`;
  }

  document.getElementById("timerTitle").innerHTML = randomQuote

  setInterval(updateCountdown, 200);
  setInterval(getPlayerCount, 10000);
  updateCountdown();
  getPlayerCount();

});
