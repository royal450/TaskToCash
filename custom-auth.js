async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

class CustomAuth {
  constructor() {
    this.currentUser = null;
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  saveUserToStorage(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearUserFromStorage() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  async signUp(email, password, referredBy = null) {
    try {
      const usersRef = firebase.database().ref('users');
      const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
      
      if (snapshot.exists()) {
        throw new Error('Email already exists');
      }

      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);
      
      const userData = {
        userId: userId,
        email: email,
        passwordHash: hashedPassword,
        passwordSalt: salt,
        referralCode: 'REF' + userId.substring(5, 13).toUpperCase(),
        balance: 0,
        taskEarnings: 0,
        referralEarnings: 0,
        totalReferrals: 0,
        joinedAt: Date.now(),
        blocked: false,
        upiId: '',
        referredBy: referredBy || ''
      };

      await firebase.database().ref('users/' + userId).set(userData);

      if (referredBy) {
        const referrerSnapshot = await usersRef.orderByChild('referralCode').equalTo(referredBy).once('value');
        if (referrerSnapshot.exists()) {
          const referrerId = Object.keys(referrerSnapshot.val())[0];
          await firebase.database().ref('users/' + referrerId + '/totalReferrals').transaction(count => (count || 0) + 1);
        }
      }

      await notifyNewUser(email, userData.referralCode);

      const userForStorage = { ...userData };
      delete userForStorage.passwordHash;
      delete userForStorage.passwordSalt;
      this.saveUserToStorage(userForStorage);

      return { user: userForStorage };
    } catch (error) {
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const usersRef = firebase.database().ref('users');
      const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
      
      if (!snapshot.exists()) {
        throw new Error('Invalid email or password');
      }

      const userId = Object.keys(snapshot.val())[0];
      const userData = snapshot.val()[userId];
      
      if (!userData.passwordSalt || !userData.passwordHash) {
        throw new Error('Invalid account data. Please contact support.');
      }

      const hashedPassword = await hashPassword(password, userData.passwordSalt);
      
      if (userData.passwordHash !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      if (userData.blocked === true) {
        throw new Error('Your account has been blocked. Contact support.');
      }

      const userForStorage = { ...userData };
      delete userForStorage.passwordHash;
      delete userForStorage.passwordSalt;
      this.saveUserToStorage(userForStorage);

      return { user: userForStorage };
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    this.clearUserFromStorage();
  }

  async signInAnonymously() {
    const anonymousUser = {
      userId: 'admin_anonymous',
      email: 'admin@dailycampaignking.com',
      isAnonymous: true
    };
    this.saveUserToStorage(anonymousUser);
    return { user: anonymousUser };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async getUserData(userId) {
    const snapshot = await firebase.database().ref('users/' + userId).once('value');
    const userData = snapshot.val();
    if (userData) {
      delete userData.passwordHash;
      delete userData.passwordSalt;
    }
    return userData;
  }

  onAuthStateChanged(callback) {
    callback(this.currentUser);
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUser') {
        this.loadUserFromStorage();
        callback(this.currentUser);
      }
    });
  }
}

const customAuth = new CustomAuth();
