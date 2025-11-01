# Daily Campaign King

## Overview
Daily Campaign King is a web-based task completion and earning platform. Users can sign up, complete tasks, earn money, and withdraw their earnings. The platform includes user authentication, referral system, admin panel, and task management features.

## Project Information
- **Type**: Static HTML/CSS/JavaScript Web Application
- **Backend**: Firebase (Authentication, Realtime Database, Storage)
- **Server**: Python HTTP Server
- **Port**: 5000
- **Deployment**: Autoscale

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Bootstrap Icons
- **Alerts**: SweetAlert2
- **Backend Services**: Firebase 9.22.0
  - ~~Firebase Authentication~~ ❌ (Replaced with custom auth)
  - Firebase Realtime Database ✅ (Only service still in use)
  - ~~Firebase Storage~~ ❌ (Replaced with Telegram uploads)
- **Authentication**: Custom client-side auth with SHA-256 + salt hashing
- **External APIs**:
  - Telegram Bot API (for notifications AND screenshot uploads)
  - ipapi.co (for IP tracking)

## Project Structure
- `index.html` - Login page (main entry point)
- `signup.html` - User registration page
- `dashboard.html` - User dashboard after login
- `tasks-page.html` - Browse available tasks
- `task.html` - Individual task completion page
- `task-complete.html` - Task completion confirmation
- `task-history.html` - User's task completion history
- `profile.html` - User profile management
- `wallet.html` - Wallet and earnings overview
- `withdraw.html` - Withdrawal request page
- `admin-panel.html` - Admin control panel
- `admin-index.html` - Admin login
- `clear-database.html` - Database management tool
- `steps.html` - User guide/instructions
- `404.html` - Error page
- `style.css` - Global styles
- `script.js` - Main JavaScript with Firebase config and Telegram integration
- `ip-tracker.js` - IP tracking functionality
- `server.py` - Python HTTP server for serving static files

## Firebase Configuration
The application uses Firebase for backend services. Firebase configuration is located in `script.js`:
- Authentication for user login/signup
- Realtime Database for user data, tasks, withdrawals
- Storage for task screenshots
- Database rules defined in `firebase-rules.json`

## Key Features
1. **User Authentication**
   - Email/password login and registration
   - Account blocking capability
   - Auto-login persistence

2. **Task System**
   - Browse available tasks
   - Complete tasks with screenshot submission
   - Task approval/rejection by admin
   - Task history tracking

3. **Earnings & Withdrawals**
   - Task earnings tracking
   - Referral earnings
   - UPI-based withdrawal system
   - Withdrawal request approval flow

4. **Referral System**
   - Unique referral codes
   - Referral tracking
   - Referral earnings

5. **Admin Panel**
   - User management (block/unblock)
   - Task creation and management
   - Task approval/rejection
   - Withdrawal approval/rejection
   - Database overview

6. **Notifications**
   - Telegram bot integration
   - Notifications for new signups, task submissions, withdrawals
   - IP tracking for security

## Development Setup
The project is set up to run on Replit with:
- Python 3.11 for the HTTP server
- Server running on `0.0.0.0:5000`
- Cache-control headers to prevent caching issues
- Workflow configured to auto-start the web server

## Running Locally
The web server is configured to start automatically. You can also manually run:
```bash
python3 server.py
```

## Deployment
Deployment is configured using Replit's autoscale deployment:
- Command: `python3 server.py`
- Type: Autoscale (for static websites)
- Port: 5000

## Security Considerations
⚠️ **IMPORTANT: Please read SECURITY_README.md for detailed security warnings**

- **Custom Authentication**: Client-side auth with SHA-256 + salt password hashing
  - ⚠️ Not as secure as server-side authentication
  - Passwords stored as hashed values in Firebase Realtime Database
  - Users are stored with salted hashes to prevent rainbow table attacks
- **Database Access**: Firebase Realtime Database is publicly accessible (rules need updating)
  - Current rules require Firebase Auth which we're not using
  - ⚠️ Security vulnerability - anyone can read/write if rules not properly configured
- **Screenshot Storage**: Sent directly to Telegram instead of Firebase Storage
  - No storage quota issues
  - Screenshots available in Telegram chat
- Firebase configuration and API keys are exposed in client-side code (standard for Firebase web apps)
- Telegram bot token is exposed in client-side code
- IP tracking is enabled for security monitoring

**Recommendation**: This setup is suitable for development/testing. For production, implement proper backend authentication or use a third-party auth service.

## Recent Changes
- **2025-11-01**: Custom Authentication Migration
  - ⚠️ **BREAKING**: Replaced Firebase Authentication with custom auth system
  - Reason: Firebase Auth quota exceeded and blocked
  - Created `custom-auth.js` with SHA-256 + salt password hashing
  - Updated all 13+ HTML pages to use custom authentication
  - Screenshot uploads now sent directly to Telegram (bypassing Firebase Storage)
  - Screenshots no longer stored in Firebase Storage (sends via Telegram Bot API)
  - Added `SECURITY_README.md` with important security warnings
  - **Security Note**: Client-side auth has limitations - see SECURITY_README.md
  
- **2025-11-01**: Initial Replit setup
  - Added Python HTTP server for static file serving
  - Configured workflow for automatic server startup
  - Set up deployment configuration
  - Added Python entries to .gitignore
  - Created project documentation

## User Preferences
- No specific preferences recorded yet

## Project Architecture
This is a traditional client-side web application with Firebase as the backend-as-a-service:
- All HTML pages are standalone and can be navigated directly
- Firebase handles all backend logic (auth, database, storage)
- External APIs used for notifications (Telegram) and IP tracking
- No build process required - pure static files
- Python HTTP server serves files with proper cache control headers
