# 🤖 How to Run Mobile App in Android Studio

Yes! You can run the mobile app in Android Studio using an Android emulator. Here's how:

## 📋 Prerequisites

1. **Android Studio** installed
2. **Android SDK** configured
3. **Android Virtual Device (AVD)** created
4. **Java Development Kit (JDK)** installed

---

## 🚀 Step-by-Step Guide

### Step 1: Install Android Studio (if not already installed)

1. Download Android Studio from: https://developer.android.com/studio
2. Install it following the installation wizard
3. Open Android Studio and complete the setup

### Step 2: Set Up Android SDK

1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. Install:
   - Android SDK Platform (latest version)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
4. Click **Apply** and wait for installation

### Step 3: Create an Android Virtual Device (AVD)

1. In Android Studio, go to **Tools → Device Manager**
   - Or click **More Actions → Virtual Device Manager**
2. Click **Create Device**
3. Select a device (e.g., **Pixel 6** or **Pixel 7**)
4. Click **Next**
5. Select a system image (e.g., **API 33** or **API 34**)
   - If not downloaded, click **Download** next to the system image
6. Click **Next**
7. Review configuration and click **Finish**
8. Your AVD is created! ✅

### Step 4: Start the Android Emulator

1. In **Device Manager**, find your created AVD
2. Click the **Play** button (▶️) next to your AVD
3. Wait for the emulator to start (this may take a few minutes the first time)
4. The Android emulator window will open, showing a virtual Android device

### Step 5: Run the Mobile App in the Emulator

Now that the emulator is running:

#### Option A: Using Expo (Easiest)

1. **Start the Expo development server:**
   ```bash
   cd Mobile_App_Ecommerce/mobile-app
   npm start
   ```

2. **When the server starts, press `a`** to open in Android emulator
   - Or type `a` in the terminal
   - Or scan the QR code shown in the terminal

3. The app will build and install on the emulator automatically!

#### Option B: Direct Command

1. **Make sure the emulator is running first** (from Step 4)

2. **Run this command:**
   ```bash
   cd Mobile_App_Ecommerce/mobile-app
   npm run android
   ```

3. The app will build and launch in the Android emulator!

---

## 🔧 Alternative: Using Expo CLI

### If you have Android Studio emulator running:

```bash
cd Mobile_App_Ecommerce/mobile-app
npm start
# Press 'a' when server starts, or run:
npx expo start --android
```

---

## ⚙️ Configuration Check

### Verify Android SDK Path

The app needs to know where Android SDK is located. Set environment variables:

**Windows:**
```powershell
# Add to your environment variables:
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
# Add to PATH:
C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools
C:\Users\YourUsername\AppData\Local\Android\Sdk\tools
```

**Check your SDK path:**
- Open Android Studio
- Go to **File → Settings → Appearance & Behavior → System Settings → Android SDK**
- Copy the "Android SDK Location" path
- That's your `ANDROID_HOME`

---

## 📱 What You'll See

Once running in Android Studio emulator:

- **Native Android app** running on virtual device
- **Bottom tab navigation** (Home, Products, Cart, Orders, Profile)
- **Touch interactions** (click with mouse = touch)
- **Keyboard input** for forms
- **Full mobile app experience**

---

## 🐛 Troubleshooting

### Issue: "Android SDK not found"
**Solution:**
- Set `ANDROID_HOME` environment variable
- Make sure Android SDK is installed in Android Studio

### Issue: "No emulator found"
**Solution:**
- Make sure you've created an AVD in Android Studio
- Start the emulator before running `npm run android`
- Or manually start emulator from Android Studio

### Issue: "Command not found: adb"
**Solution:**
- Add Android SDK platform-tools to PATH
- Restart terminal after setting environment variables

### Issue: "Gradle build failed"
**Solution:**
- Make sure Java JDK is installed
- Set `JAVA_HOME` environment variable
- Check Android Studio has latest build tools

### Issue: "Emulator is slow"
**Solution:**
- Enable hardware acceleration in AVD settings
- Allocate more RAM to emulator (2GB+ recommended)
- Use x86_64 system images (faster than ARM)

---

## ✅ Quick Start Command

**After setting up Android Studio:**

1. **Start emulator** from Android Studio Device Manager
2. **Wait for emulator to fully boot**
3. **Run in terminal:**
   ```bash
   cd Mobile_App_Ecommerce/mobile-app
   npm run android
   ```

That's it! The app will build and run on the emulator.

---

## 📝 Notes

- **First build may take 5-10 minutes** (downloading dependencies)
- **Emulator must be running** before running `npm run android`
- **Keep Android Studio open** while using emulator
- **You can close Android Studio** after emulator starts, but keep emulator running

---

## 🎯 Recommended Setup

1. ✅ Android Studio installed
2. ✅ AVD created (Pixel 6 or Pixel 7 recommended)
3. ✅ Android SDK configured
4. ✅ Environment variables set (ANDROID_HOME, PATH)
5. ✅ Emulator started
6. ✅ Run `npm run android`

---

**Happy coding! Your app will run beautifully in Android Studio!** 🤖✨

