# 📱 How to Build APK File - Complete Guide

This guide will help you build a standalone APK file that can be installed on any Android device without Google Play Store.

---

## 🎯 Overview

You'll build an **APK file** that:
- ✅ Can be installed directly on Android devices
- ✅ Works without Expo Go app
- ✅ Can be shared with others
- ✅ Standalone application

---

## 📋 Prerequisites

1. **Expo Account** (free) - Create at https://expo.dev/signup
2. **EAS CLI** (Expo Application Services)
3. **Android Studio** (for SDK)
4. **Java JDK** installed

---

## 🚀 Step-by-Step Process

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

Or install locally:
```bash
cd Mobile_App_Ecommerce/mobile-app
npm install --save-dev eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials (create one at https://expo.dev if you don't have it).

### Step 3: Configure EAS Build

```bash
cd Mobile_App_Ecommerce/mobile-app
eas build:configure
```

This will create/update `eas.json` file with build configuration.

### Step 4: Update app.json (Important!)

Make sure your `app.json` has proper Android configuration:

```json
{
  "expo": {
    "android": {
      "package": "com.ecommerce.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#ffffff"
      },
      "permissions": []
    }
  }
}
```

### Step 5: Build APK File

#### Option A: Build APK Locally (Requires Android SDK setup)

```bash
eas build --platform android --profile preview
```

Or for production build:
```bash
eas build --platform android --profile production
```

#### Option B: Build APK on Expo Servers (Easier - Recommended)

```bash
eas build --platform android --profile preview
```

This will:
1. Upload your code to Expo servers
2. Build the APK on their servers
3. Provide download link when done

---

## ⚙️ EAS Build Configuration

### Create/Update `eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📦 Building Process

### Method 1: Cloud Build (Recommended - Easiest)

```bash
cd Mobile_App_Ecommerce/mobile-app
eas build --platform android --profile preview
```

**Steps:**
1. Expo will ask for app details (press Enter for defaults)
2. Uploads your project to Expo servers
3. Builds APK on cloud (takes 10-20 minutes)
4. Provides download link
5. Download the APK file

**Advantages:**
- ✅ No Android SDK setup needed
- ✅ Works on any OS (Windows, Mac, Linux)
- ✅ Cloud-based build

### Method 2: Local Build (Faster, but requires setup)

#### Setup Local Build:

1. **Install Android Studio** with Android SDK
2. **Set Environment Variables:**
   ```powershell
   # Windows PowerShell
   $env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

3. **Build Locally:**
   ```bash
   eas build --platform android --profile preview --local
   ```

**Advantages:**
- ✅ Faster build (no upload time)
- ✅ Build offline
- ❌ Requires Android SDK setup

---

## 🔧 Complete Build Configuration

### Step 1: Update app.json

Make sure your `app.json` has all required fields:

```json
{
  "expo": {
    "name": "E-Commerce Mobile",
    "slug": "ecommerce-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#007AFF",
      "resizeMode": "contain"
    },
    "android": {
      "package": "com.ecommerce.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": []
    },
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "apiUrl": "http://localhost:5001/api"
    }
  }
}
```

**IMPORTANT:** Change `apiUrl` to your production backend URL:
```json
"extra": {
  "apiUrl": "https://your-backend-domain.com/api"
}
```

### Step 2: Create eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Step 3: Build APK

```bash
eas build --platform android --profile preview
```

---

## 📥 Download and Install APK

### Step 1: Download APK

After build completes:
1. Expo will provide a download link
2. Download the `.apk` file to your computer

### Step 2: Transfer to Android Device

**Option A: Via USB**
- Connect Android device to computer
- Copy APK file to device storage
- Install from device's file manager

**Option B: Via Cloud/Email**
- Upload APK to Google Drive/Dropbox
- Share link or send via email
- Download on Android device

### Step 3: Install APK

1. **Enable Unknown Sources:**
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Install unknown apps"
   
2. **Open APK File:**
   - Use file manager to find APK
   - Tap the APK file
   - Tap "Install"

3. **Done!** App is installed! 🎉

---

## 🔄 Updating the App

### For Development Changes:

**Hot Reload:** Changes automatically update when running:
```bash
npm start
# or
npm run android
```

### For APK Updates:

1. **Update version in app.json:**
   ```json
   "version": "1.0.1",  // Increment version
   "android": {
     "versionCode": 2  // Increment version code
   }
   ```

2. **Rebuild APK:**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Distribute new APK** to users

---

## 🌐 Backend Configuration for APK

### Important: Change API URL for Production

The APK won't work with `localhost` - you need a real backend URL!

#### Option 1: Deploy Backend to Cloud

**Services:**
- Heroku
- Railway
- DigitalOcean
- AWS
- Azure

**Steps:**
1. Deploy backend to cloud service
2. Get your backend URL (e.g., `https://my-ecommerce-api.herokuapp.com`)
3. Update `app.json`:
   ```json
   "extra": {
     "apiUrl": "https://my-ecommerce-api.herokuapp.com/api"
   }
   ```
4. Rebuild APK

#### Option 2: Use Your Computer's IP (For Testing)

**For same network testing:**
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Update `app.json`:
   ```json
   "extra": {
     "apiUrl": "http://192.168.1.100:5001/api"
   }
   ```

3. Make sure backend is running and accessible from network

4. Rebuild APK

**Note:** This only works if phone and computer are on same WiFi network.

---

## 📱 Complete Deployment Checklist

### Before Building APK:

- [ ] Update API URL in `app.json` (remove localhost)
- [ ] Add app icon (`assets/icon.png`)
- [ ] Add splash screen (`assets/splash.png`)
- [ ] Update app name, version
- [ ] Test app thoroughly
- [ ] Ensure backend is deployed or accessible

### Build Process:

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Configure build: `eas build:configure`
- [ ] Create `eas.json` file
- [ ] Build APK: `eas build --platform android --profile preview`
- [ ] Wait for build to complete
- [ ] Download APK file

### Distribution:

- [ ] Share APK file with users
- [ ] Provide installation instructions
- [ ] Include backend URL/configuration if needed

---

## 🎯 Quick Build Command Summary

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure (first time only)
eas build:configure

# 4. Build APK
eas build --platform android --profile preview

# 5. Download APK from link provided
```

---

## 💡 Tips

1. **Test Thoroughly:** Test on real device before distributing
2. **Version Numbers:** Always increment version and versionCode for updates
3. **Backend URL:** Never use localhost in production APK
4. **Permissions:** Add only necessary permissions in `app.json`
5. **Icon & Splash:** Add proper app icons for professional look
6. **Signing:** Production builds are automatically signed by Expo

---

## ❓ FAQ

**Q: Can I install APK on any Android device?**  
A: Yes! Works on all Android devices (Android 5.0+)

**Q: Does user need Google Play Store?**  
A: No! APK can be installed directly

**Q: Can I update the app after installing?**  
A: Yes, but users need to install new APK manually (or use OTA updates)

**Q: Is it free?**  
A: Yes! Expo free tier allows APK builds

**Q: How big is the APK?**  
A: Typically 20-50 MB for Expo apps

**Q: Can I build multiple times?**  
A: Yes, unlimited builds on free tier

---

## 🚀 Next Steps After APK is Ready

1. ✅ Test APK on real Android device
2. ✅ Share APK file with users
3. ✅ Provide installation instructions
4. ✅ Deploy backend to cloud (if not done)
5. ✅ Update API URLs in app.json
6. ✅ Rebuild if needed

---

**Ready to build? Follow the steps above and you'll have your APK in 20-30 minutes!** 📱✨

