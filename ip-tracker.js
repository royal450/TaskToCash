// IP Tracking and Location Detection
// This script tracks user IP, location, and sends comprehensive data to Telegram

async function getUserIPInfo() {
  try {
    // Get IP and location information
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      postal: data.postal || 'Unknown',
      isp: data.org || 'Unknown',
      lat: data.latitude || 0,
      lon: data.longitude || 0,
      timezone: data.timezone || 'Unknown'
    };
  } catch (error) {
    console.error('IP tracking error:', error);
    return {
      ip: 'Failed to fetch',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      postal: 'Unknown',
      isp: 'Unknown',
      lat: 0,
      lon: 0,
      timezone: 'Unknown'
    };
  }
}

// Track user activity and send to Telegram
async function trackUserActivity(activityType, details) {
  try {
    const ipInfo = await getUserIPInfo();
    const user = firebase.auth().currentUser;
    let userInfo = { email: 'Not logged in' };
    
    if (user) {
      const snapshot = await firebase.database().ref('users/' + user.uid).once('value');
      userInfo = snapshot.val() || {};
    }
    
    const message = `
🔔 <b>${activityType}</b>

👤 <b>User Info:</b>
📧 Email: ${userInfo.email || 'Not logged in'}
💰 Balance: ₹${userInfo.balance || 0}
🎁 Referrals: ${userInfo.totalReferrals || 0}

📍 <b>Location Info:</b>
🌐 IP: ${ipInfo.ip}
🏙️ City: ${ipInfo.city}
📮 Region: ${ipInfo.region}
🌍 Country: ${ipInfo.country}
📌 PIN: ${ipInfo.postal}
📡 ISP: ${ipInfo.isp}
🕐 Timezone: ${ipInfo.timezone}

📊 <b>Details:</b>
${details}

📅 Time: ${new Date().toLocaleString('en-IN')}
    `.trim();
    
    sendTelegramNotification(message);
  } catch (error) {
    console.error('Activity tracking error:', error);
  }
}

// Log user session on page load
window.addEventListener('load', () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const pageName = window.location.pathname.split('/').pop() || 'homepage';
      await trackUserActivity('👁️ PAGE VIEW', `Page: ${pageName}`);
    }
  });
});
