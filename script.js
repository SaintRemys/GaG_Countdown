window.addEventListener('load', async function () {

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


    async function getPlayerCount() {
        const experienceId = "7436755782";
        const url = `https://games.roproxy.com/v1/games?universeIds=${experienceId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const count = data.data[0]?.playing ?? 0;
            updatePlayerCount(count);
        } catch (error) {
            document.getElementById("playerCount").textContent = `ERR: Broken :(`;
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

    setInterval(updateCountdown, 1000);
    setInterval(getPlayerCount, 10000);
    updateCountdown();
    getPlayerCount();

});
