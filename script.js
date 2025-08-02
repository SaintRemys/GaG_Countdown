window.addEventListener('load', async function () {
  let playerCount = 0;
  let playerRecord = parseInt(localStorage.getItem("playerRecord")) || 21461453;
  let playerRecordTime = parseInt(localStorage.getItem("playerRecordTime")) || null;
  const internalRecordedRecord = 21461453
  
  if (playerRecord < internalRecordedRecord) {
    playerRecord = internalRecordedRecord
  };

  const sheet = document.styleSheets[0];
  const experienceId = "7436755782";
  const url = `https://games.roproxy.com/v1/games?universeIds=${experienceId}`;

  const possibleTimerTQuotes = [
    "Time left of functional Roblox Servers:",
    "Time left of Roblox online:",
    "Time left until disaster strikes:",
    "Time left until Grow a Garden updates:",
    "Time left until Roblox dies:"
  ];

  const randomQuote = possibleTimerTQuotes[Math.floor(Math.random() * possibleTimerTQuotes.length)];
  document.getElementById("timerTitle").innerHTML = randomQuote;

  function updatePlayerCount(number) {
    const digitsOnly = number.toString().padStart(8, '0');
    const digitWrappers = document.querySelectorAll('#playerCount .digit-wrapper');

    digitsOnly.split('').forEach((digit, i) => {
      const wrapper = digitWrappers[i];
      const offset = parseInt(digit) * -2.5;
      wrapper.style.transform = `translateY(${offset}rem)`;

      if (i === 0) {
        const outerDigitSpan = wrapper.parentElement;
        outerDigitSpan.style.display = digit === '0' ? 'none' : '';
      }
    });
  }

  function odometerColor(id) {
    for (let rule of sheet.cssRules) {
      if (rule.selectorText === ".odometer-player") {
        rule.style.color = id === 1 ? "#ffff00" : "#ffffff";
        break;
      }
    }
  }

function timeAgo(timestamp) {
  const now = Date.now();
  let diff = Math.floor((now - timestamp) / 1000);

  const units = [
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  const parts = [];

  for (let unit of units) {
    const value = Math.floor(diff / unit.seconds);
    if (value > 0) {
      parts.push(`${value} ${unit.label}${value !== 1 ? 's' : ''}`);
      diff %= unit.seconds;
    }
    if (parts.length === 3) break;
  }

  return (parts.length ? parts.join(', ') : '0 seconds') + ' ago';
}


  let lastPlayerCount = 0;
  let increment = 0;

  async function getPlayerCount() {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const count = data.data[0]?.playing ?? 0;

      if (lastPlayerCount !== 0) increment = count - lastPlayerCount;
      lastPlayerCount = count;
      updatePlayerCount(count);
      odometerColor(0);
      playerCount = count;

      if (playerCount > playerRecord) {
        playerRecord = playerCount;
        playerRecordTime = Date.now();
        localStorage.setItem("playerRecord", playerRecord.toString());
        localStorage.setItem("playerRecordTime", playerRecordTime.toString());
      }
    } catch (error) {
      const fallbackCount = lastPlayerCount + increment;
      updatePlayerCount(fallbackCount);
      lastPlayerCount += increment;
      odometerColor(1);
      playerCount = fallbackCount;

      if (playerCount > playerRecord) {
        playerRecord = playerCount;
        playerRecordTime = Date.now();
        localStorage.setItem("playerRecord", playerRecord.toString());
        localStorage.setItem("playerRecordTime", playerRecordTime.toString());
      }
    }

    document.getElementById("prCount").textContent = `${playerRecord.toLocaleString()} Players`;
    if (playerRecordTime) {
      document.getElementById("prTime").textContent = timeAgo(playerRecordTime);
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
      14, 0, 0
    ));

    if (target <= now) {
      document.getElementById("timerTitle").innerHTML = "Game updated."
      return
    };

    const diff = target - now;
    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    document.getElementById("timer").textContent =
      `${String(d).padStart(2, '0')}:${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  setInterval(getPlayerCount, 10000);
  getPlayerCount();

  setInterval(() => {
    if (playerRecordTime) {
      document.getElementById("prTime").textContent = timeAgo(playerRecordTime);
    }
  }, 1000);

  setInterval(updateCountdown, 200);
  updateCountdown();
});



