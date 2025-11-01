
// Firebase Configuration - Daily Campaign King (Main App)
// Get your actual config from: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyBuioOF7DCq-qIoa1D6ZyZbrAVeGjbfv3Y",
  authDomain: "daily-campaign-king.firebaseapp.com",
  databaseURL: "https://daily-campaign-king-default-rtdb.firebaseio.com",
  projectId: "daily-campaign-king",
  storageBucket: "get-good-night.appspot.com",
  messagingSenderId: "925353220910",
  appId: "1:925353220910:web:8a4c3f7e5b6d9c1a2b3c4d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '7591812660:AAHSUmsy1zpcYh0AWR2G6AGG5-kDS2FqOV8';
const TELEGRAM_CHAT_ID = '6320914640';

// Send text message to Telegram
function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
  .catch(error => console.error('Telegram notification error:', error));
}

// Send photo to Telegram with caption
function sendTelegramPhoto(photoUrl, caption) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      photo: photoUrl,
      caption: caption,
      parse_mode: 'HTML'
    })
  })
  .catch(error => console.error('Telegram photo error:', error));
}

// Get IP and location information
async function getIPInfo() {
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (!response.ok) throw new Error('IP API failed');
    const data = await response.json();
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      postal: data.postal || 'Unknown',
      isp: data.org || 'Unknown',
      lat: data.latitude || 0,
      lon: data.longitude || 0
    };
  } catch (error) {
    console.error('IP fetch error:', error);
    return { 
      ip: 'Unknown', 
      city: 'Unknown', 
      region: 'Unknown', 
      country: 'India', 
      postal: 'Unknown', 
      isp: 'Unknown', 
      lat: 0, 
      lon: 0 
    };
  }
}

// Enhanced notification for task submission with screenshot and IP tracking
async function notifyTaskSubmission(userEmail, taskNumber, screenshotUrl, reviewText) {
  const ipInfo = await getIPInfo();
  const caption = `🎯 <b>New Task Submitted!</b>\n\n👤 <b>User Info:</b>\n📧 Email: ${userEmail}\n📋 Task: ${taskNumber}\n💬 Comment: ${reviewText.substring(0, 80)}...\n\n📍 <b>Location:</b>\n🌐 IP: ${ipInfo.ip}\n🏙️ City: ${ipInfo.city}\n📮 Region: ${ipInfo.region}\n🌍 Country: ${ipInfo.country}\n📌 PIN: ${ipInfo.postal}\n📡 ISP: ${ipInfo.isp}\n\n⏳ Status: Pending Approval\n📅 ${new Date().toLocaleString('en-IN')}`;
  
  sendTelegramPhoto(screenshotUrl, caption);
}

// Enhanced notification for withdrawal request with IP tracking
async function notifyWithdrawal(userEmail, amount, upiId) {
  const ipInfo = await getIPInfo();
  const message = `💰 <b>Withdrawal Request!</b>\n\n👤 <b>User Info:</b>\n📧 Email: ${userEmail}\n💵 Amount: ₹${amount}\n📱 UPI: ${upiId}\n\n📍 <b>Location:</b>\n🌐 IP: ${ipInfo.ip}\n🏙️ City: ${ipInfo.city}\n📮 Region: ${ipInfo.region}\n🌍 Country: ${ipInfo.country}\n📌 PIN: ${ipInfo.postal}\n📡 ISP: ${ipInfo.isp}\n\n⏳ Pending Approval\n📅 ${new Date().toLocaleString('en-IN')}`;
  
  sendTelegramNotification(message);
}

// Enhanced notification for new user signup with IP tracking
async function notifyNewUser(email, referralCode) {
  const ipInfo = await getIPInfo();
  const message = `👤 <b>New User Registered!</b>\n\n📧 Email: ${email}\n🎁 Referral Code: ${referralCode}\n\n📍 <b>Location Info:</b>\n🌐 IP: ${ipInfo.ip}\n🏙️ City: ${ipInfo.city}\n📮 Region: ${ipInfo.region}\n🌍 Country: ${ipInfo.country}\n📌 PIN: ${ipInfo.postal}\n📡 ISP: ${ipInfo.isp}\n\n📅 ${new Date().toLocaleString('en-IN')}`;
  
  sendTelegramNotification(message);
}

// Notification for task approval
function notifyTaskApproval(userEmail, taskNumber, amount) {
  const message = `✅ <b>Task Approved!</b>\n\n👤 User: ${userEmail}\n📋 Task: ${taskNumber}\n💰 Credited: ₹${amount}\n📅 ${new Date().toLocaleString('en-IN')}`;
  
  sendTelegramNotification(message);
}

// Notification for withdrawal approval
function notifyWithdrawalApproval(userEmail, amount) {
  const message = `✅ <b>Withdrawal Processed!</b>\n\n👤 User: ${userEmail}\n💵 Amount: ₹${amount}\n\n⚠️ Send payment via UPI\n📅 ${new Date().toLocaleString('en-IN')}`;
  
  sendTelegramNotification(message);
}

// Track user page views
async function trackPageView(pageName) {
  const user = firebase.auth().currentUser;
  if (user) {
    const ipInfo = await getIPInfo();
    const userSnapshot = await firebase.database().ref('users/' + user.uid).once('value');
    const userData = userSnapshot.val() || {};
    
    const message = `👁️ <b>Page View: ${pageName}</b>\n\n👤 ${userData.email}\n💰 Balance: ₹${userData.balance || 0}\n🌐 IP: ${ipInfo.ip}\n🏙️ ${ipInfo.city}, ${ipInfo.country}\n📡 ${ipInfo.isp}\n📅 ${new Date().toLocaleString('en-IN')}`;
    
    sendTelegramNotification(message);
  }
}
