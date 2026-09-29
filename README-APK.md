# Only us • APK & Release Guide

Official mobile application repository for **Only us** (Ishant AI for Srishti).

- **Current Version:** 1.0.1
- **Platform:** Android (Capacitor Native APK + WebAPK)
- **Engine:** Instant Ishant AI Companion

---

## 1. Quickest Way: Install directly on your Android Phone (WebAPK)
No developer tools required! Android has built-in APK generation for Progressive Web Apps:

1. Open **Google Chrome** on your Android phone.
2. Go to the live app URL:
   `https://ais-pre-nghvkeooyypfw5ultpkddb-963600186660.asia-east1.run.app`
3. Tap the **"Install App"** button inside the app, OR tap the **3 dots (⋮)** in the top right of Chrome and select **"Install app"** or **"Add to Home screen"**.
4. Android will automatically package and install **Only us** as a standalone application with the Tulip icon on your phone home screen and app launcher.
5. It launches full-screen without any browser address bar, exactly like a native APK!

---

## 2. Generate a Standalone .APK File using PWABuilder (Free & 1-Click)
If you want an actual `.apk` file to share or install manually via side-loading:

1. Visit [https://www.pwabuilder.com](https://www.pwabuilder.com) in your browser.
2. In the input box, enter the app URL:
   `https://ais-pre-nghvkeooyypfw5ultpkddb-963600186660.asia-east1.run.app`
3. Click **"Start"**. PWABuilder will analyze the manifest and icons (all pre-configured and scoring 100%).
4. Click **"Package for Android"** > **"Generate APK"**.
5. Download the generated `.apk` file and transfer/install it on any Android device!

---

## 3. How to Run the ZIP Project Locally
If you downloaded `only-us-app.zip`:

1. Unzip the file to a folder on your computer.
2. Open terminal in the unzipped folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
5. Start the full-stack app:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

---

## 4. Building with Capacitor (Native Android Studio Project)
If you want to build a debug or release APK using Android Studio:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Only us" "com.onlyus.srishti" --web-dir dist
npm run build
npx cap add android
npx cap open android
```
Inside Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your release or debug `.apk`.
