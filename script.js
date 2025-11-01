
// Firebase Configuration - Daily Campaign King (Main App)
// Get your actual config from: Firebase Console > Project Settings > Your apps > Web app

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5XRIVrqI9tM-hnkQOfEaGbFW_5C9B0iA",
  authDomain: "kingapp-dbcde.firebaseapp.com",
  databaseURL: "https://kingapp-dbcde-default-rtdb.firebaseio.com",
  projectId: "kingapp-dbcde",
  storageBucket: "kingapp-dbcde.appspot.com",
  messagingSenderId: "30155737602",
  appId: "1:30155737602:web:4fc3b3e961097b1e47b51b",
  measurementId: "G-S0591W111V"
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
      countryCode: data.country_code || 'IN',
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
      countryCode: 'IN',
      postal: 'Unknown', 
      isp: 'Unknown', 
      lat: 0, 
      lon: 0 
    };
  }
}

// Currency configuration based on country
let userCurrency = {
  symbol: '₹',
  code: 'INR',
  taskPrice: 2,
  minWithdrawal: 50,
  withdrawalMethod: 'UPI'
};

// Initialize currency based on user location
async function initializeCurrency() {
  const ipInfo = await getIPInfo();
  
  if (ipInfo.countryCode !== 'IN') {
    userCurrency = {
      symbol: '$',
      code: 'USD',
      taskPrice: 0.01,
      minWithdrawal: 1,
      withdrawalMethod: 'Trust Wallet'
    };
  }
  
  localStorage.setItem('userCurrency', JSON.stringify(userCurrency));
  return userCurrency;
}

// Get currency settings
function getCurrency() {
  const stored = localStorage.getItem('userCurrency');
  if (stored) {
    return JSON.parse(stored);
  }
  return userCurrency;
}

// Format currency
function formatCurrency(amount) {
  const curr = getCurrency();
  return `${curr.symbol}${amount}`;
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
  const user = customAuth ? customAuth.getCurrentUser() : null;
  if (user) {
    const ipInfo = await getIPInfo();
    const userSnapshot = await firebase.database().ref('users/' + user.userId).once('value');
    const userData = userSnapshot.val() || {};
    
    const message = `👁️ <b>Page View: ${pageName}</b>\n\n👤 ${userData.email}\n💰 Balance: ₹${userData.balance || 0}\n🌐 IP: ${ipInfo.ip}\n🏙️ ${ipInfo.city}, ${ipInfo.country}\n📡 ${ipInfo.isp}\n📅 ${new Date().toLocaleString('en-IN')}`;
    
    sendTelegramNotification(message);
  }
}
