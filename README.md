# ☕ Coffee PassGen Pro

<div align="center">
  <img src="www/icon-192.png" alt="CoffeePass Logo" width="150" />
  <br>
  <i>An aesthetic, offline-first, and secure password generator app.</i>
</div>

---

## 📖 Overview
**Coffee PassGen Pro** is a modern, coffee-themed password and passphrase generator designed to be beautiful, functional, and **100% offline-ready**. It generates highly secure passwords locally on your device without sending any data over the internet. Built as a Progressive Web App (PWA), it can be installed directly onto your mobile or desktop devices.

## ✨ Key Features
- **🔑 Three Modes:** 
  - **Password:** Generate complex passwords with uppercase, lowercase, numbers, and symbols.
  - **Passphrase:** Generate memorable, readable passphrases with custom separators and capitalizations.
  - **Custom:** Input your own custom password/passphrase to evaluate its strength and generate a QR code.
- **🛡️ Strength & Crack Time Indicator:** Real-time evaluation of how long a brute-force attack would take to crack the password.
- **📱 QR Code Export:** Generate and save a beautifully designed "digital card" image containing the QR code of your password for easy scanning and secure storage on other devices.
- **🔌 100% Offline (PWA):** Works seamlessly without an internet connection using Service Workers. Completely safe and private.
- **🎨 Premium UI/UX:** A visually pleasing beige and brown coffee-themed design.
- **🤖 Android Ready:** Configured with Capacitor to be easily converted into a native Android APK.

## 🛠️ Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript
- **Libraries (Local):** 
  - `qrious.min.js` (for generating QR Codes)
  - `html2canvas.min.js` (for rendering the UI into a downloadable image)
- **Framework:** Capacitor (for Android packaging)
- **Deployment:** GitHub Pages / Any Static Host (Served from the `www/` folder)

## 🚀 How to Run & Deploy

### 1. Web Hosting (GitHub Pages, Netlify, Vercel)
To host this application as a web app:
1. Upload the entire project to a GitHub repository.
2. Go to **Settings > Pages**.
3. Set the source directory to the **`www`** folder (or simply upload only the contents of the `www` folder to the root of your repo).
4. Save, and your app is live!

### 2. Installing as PWA (Progressive Web App)
1. Open the hosted link on your mobile browser (e.g., Chrome or Safari).
2. Tap the browser menu and select **"Add to Home Screen"** or **"Install App"**.
3. The app will be installed on your device with its official logo and will function completely offline.

### 3. Building for Android (Capacitor)
If you wish to compile this into a native Android APK:
```bash
# Ensure dependencies are installed
npm install

# Sync the latest web assets to the Android folder
npx cap sync android

# Open Android Studio to build the APK
npx cap open android
```

## 📂 Project Structure
```text
/
├── www/                   # 🌐 Main Web App files (Deploy this!)
│   ├── index.html         # Main structure
│   ├── style.css          # Styling & Themes
│   ├── script.js          # Logic, Generators, and Canvas logic
│   ├── manifest.json      # PWA Configuration
│   ├── sw.js              # Service Worker for Offline Mode
│   ├── icon-192.png       # PWA Logo (Small)
│   ├── icon-512.png       # PWA Logo (Large)
│   ├── qrious.min.js      # QR Library
│   └── html2canvas.min.js # Screenshot Library
├── android/               # 🤖 Capacitor Android project files
├── capacitor.config.json  # Capacitor configurations
├── package.json           # Node modules and dependencies
└── README.md              # Project Documentation
```

## 🔒 Privacy & Security
- **Zero Tracking:** No analytics, trackers, or external network requests are made.
- **Local Generation:** All passwords and QR codes are generated directly in your browser using JavaScript. No server is involved.
