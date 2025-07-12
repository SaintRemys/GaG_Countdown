window.addEventListener('load', async function () {
let playerCount = 0;
let playerRecord = parseInt(localStorage.getItem("playerRecord")) || 21461453;
let playerRecordTime = parseInt(localStorage.getItem("playerRecordTime")) || null;

const sheet = document.styleSheets[0];
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
   outerDigitSpan.style.display = digit === '0' ? 'none' : '';
  }
 });
}

function timeAgo(timestamp) {
 const now = Date.now();
 const diff = Math.floor((now - timestamp) / 1000);

 if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
 if (diff < 3600) {
   const m = Math.floor(diff / 60);
   return `${m} minute${m !== 1 ? 's' : ''} ago`;
 }
 if (diff < 86400) {
   const h = Math.floor(diff / 3600);
   return `${h} hour${h !== 1 ? 's' : ''} ago`;
 }
 if (diff < 604800) {
   const d = Math.floor(diff / 86400);
   return `${d} day${d !== 1 ? 's' : ''} ago`;
 }
 const w = Math.floor(diff / 604800);
 return `${w} week${w !== 1 ? 's' : ''} ago`;
}

const possibleTimerTQuotes = [
 "Time left of functional Roblox Servers:",
 "Time left of Roblox online:",
 "Time left until disaster strikes:",
 "Time left until Grow a Garden updates:",
 "Time left until Roblox dies:"
];

const randomQuote = possibleTimerTQuotes[Math.floor(Math.random() * possibleTimerTQuotes.length)];

let lastPlayerCount = 0;
let increment = 0;

function odometerColor(id) {
 for (let rule of sheet.cssRules) {
  if (rule.selectorText === ".odometer-player") {
   rule.style.color = id === 1 ? "#ffff00" : "#ffffff";
   break;
  }
 }
}

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

  document.getElementById("prCount").textContent = `${playerRecord.toLocaleString()} Players`;
  if (playerRecordTime) {
    document.getElementById("prTime").textContent = timeAgo(playerRecordTime);
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

  document.getElementById("prCount").textContent = `${playerRecord.toLocaleString()} Players`;
  if (playerRecordTime) {
    document.getElementById("prTime").textContent = timeAgo(playerRecordTime);
  }
 }
}

document.getElementById("timerTitle").innerHTML = randomQuote;

setInterval(getPlayerCount, 10000);
getPlayerCount();

setInterval(() => {
 if (playerRecordTime) {
   document.getElementById("prTime").textContent = timeAgo(playerRecordTime);
 }
}, 1000);
});
