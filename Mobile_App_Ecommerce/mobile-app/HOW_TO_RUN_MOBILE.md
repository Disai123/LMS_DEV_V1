# 📱 How to Run the Mobile App

## Current Situation
You're currently seeing the mobile app running in **web mode** (localhost:8081). This shows the app in a browser window, which might look confusing.

## 🎯 Ways to Run the Mobile App

### Option 1: Run on Real Mobile Device (Recommended for Best Experience)

#### Step 1: Install Expo Go on Your Phone
- **iOS**: Download "Expo Go" from the App Store
- **Android**: Download "Expo Go" from Google Play Store

#### Step 2: Start the Development Server
```bash
cd Mobile_App_Ecommerce/mobile-app
npm start
```

This will show a QR code in your terminal/command prompt.

#### Step 3: Connect Your Phone
- **iOS**: Open Camera app → Scan QR code → Opens in Expo Go
- **Android**: Open Expo Go app → Tap "Scan QR code" → Scan QR code

#### Step 4: Use the App
The app will load on your phone! You can interact with it like a real mobile app.

---

### Option 2: Run on Android Emulator

#### Prerequisites:
- Install Android Studio
- Set up an Android Virtual Device (AVD)

#### Steps:
```bash
cd Mobile_App_Ecommerce/mobile-app
npm run android
```

This will open the app in an Android emulator.

---

### Option 3: Run on iOS Simulator (Mac Only)

#### Prerequisites:
- Mac computer required
- Xcode installed

#### Steps:
```bash
cd Mobile_App_Ecommerce/mobile-app
npm run ios
```

This will open the app in an iOS simulator.

---

### Option 4: Continue Using Web (Current)

If you want to continue testing in the browser:
```bash
cd Mobile_App_Ecommerce/mobile-app
npm run web
```

**Note**: The web version might look different from the actual mobile experience.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies (if not done)
```bash
cd Mobile_App_Ecommerce/mobile-app
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Choose Your Platform
When the server starts, you'll see options:
- Press `w` - Run in web browser
- Press `a` - Run in Android emulator
- Press `i` - Run in iOS simulator (Mac only)
- Press `r` - Reload the app
- Scan QR code - Open on real device (Expo Go)

---

## 📱 Recommended: Use Real Device (Expo Go)

**Why?**
- Best mobile experience
- Test actual touch interactions
- See how it looks on real screen
- Test device features (camera, notifications, etc.)

**Steps:**
1. Install Expo Go on your phone
2. Run `npm start` in the project folder
3. Scan the QR code with your phone
4. App loads instantly!

---

## 🔧 Troubleshooting

### "Can't connect to server"
- Make sure your phone and computer are on the same WiFi network
- Or use tunnel mode: Press `s` → Select "tunnel" option

### "Expo Go not found"
- Make sure Expo Go is installed on your phone
- Make sure you're scanning the QR code correctly

### Port Already in Use
```bash
# Kill process on port 8081
npx kill-port 8081
npm start
```

---

## 📋 Mobile App Features

Once running on mobile, you'll see:

### Main Screens:
- **Home Tab** - Featured products and categories
- **Products Tab** - Browse all products
- **Cart Tab** - Shopping cart
- **Orders Tab** - Order history
- **Profile Tab** - User profile and settings

### For Admin Users:
- **Admin Panel** button in Profile tab
- Admin Dashboard with statistics
- Manage Products (Create, Edit, Delete)
- Manage Orders (View, Update Status)

---

## 🎨 UI Features

- Native mobile navigation (bottom tabs)
- Touch-friendly buttons and inputs
- Pull-to-refresh on lists
- Mobile-optimized layouts
- Smooth animations and transitions

---

**Try running it on your phone with Expo Go for the best experience!** 📱✨

