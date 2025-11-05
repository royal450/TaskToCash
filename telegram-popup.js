let telegramPopupShown = false;
let telegramPopupInterval = null;

function showTelegramChannelPopup() {
  if (!telegramPopupShown || (Date.now() - parseInt(localStorage.getItem('lastTelegramPopup') || '0')) > 120000) {
    Swal.fire({
      title: '🎉 Join Our Community!',
      html: `
        <div style="text-align: center; padding: 10px;">
          <i class="bi bi-telegram" style="font-size: 4rem; color: #0088cc;"></i>
          <h4 style="margin-top: 15px; color: #333;">Get Latest Updates!</h4>
          <p style="color: #666;">Join our Telegram channel for:</p>
          <ul style="text-align: left; display: inline-block; color: #555;">
            <li>💰 New Tasks & Earning Tips</li>
            <li>🎁 Exclusive Bonuses</li>
            <li>📢 Important Announcements</li>
            <li>🏆 Contests & Rewards</li>
          </ul>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-telegram"></i> Join Channel',
      cancelButtonText: 'Later',
      confirmButtonColor: '#0088cc',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'telegram-popup-animated'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('https://t.me/EarningByRoyal', '_blank');
        localStorage.setItem('lastTelegramPopup', Date.now().toString());
      } else {
        localStorage.setItem('lastTelegramPopup', Date.now().toString());
      }
    });
    
    telegramPopupShown = true;
  }
}

function startTelegramPopupTimer() {
  if (!telegramPopupInterval) {
    setTimeout(() => {
      showTelegramChannelPopup();
      telegramPopupInterval = setInterval(showTelegramChannelPopup, 120000);
    }, 10000);
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    startTelegramPopupTimer();
  });
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startTelegramPopupTimer();
  }
}
