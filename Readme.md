# 🍱 Lunchbox Legends Mobile

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?style=for-the-badge&logo=react)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Customer mobile application for the Lunchbox Legends cloud kitchen subscription ecosystem.**

</div>

---
<div align="center">

### Preview Showcase [WEBLINK👈](https://ajardeen.netlify.app/project/lunchbox-legends)

⭐ **Make Sure Check it out!** ⭐

</div>

---

# 📱 About the App

**Lunchbox Legends Mobile** is a customizable multi-tenant food subscription mobile application built for cloud kitchens and meal subscription businesses.

The application connects directly with the Lunchbox Legends backend and business portal ecosystem, allowing customers to:

- Register and log in securely
- Browse available meal bundles
- View calorie and nutrition details
- Subscribe to weekly meal plans
- Track live delivery progress
- Manage subscriptions and addresses

The platform is designed to support multiple organizations and brands using:

- `organizationId`
- `branchId`

This allows a single backend ecosystem to power multiple branded cloud kitchen businesses with different UI styles, branding, and menus.

---

# 🏗 Multi-Tenant Architecture

```text
Customer Mobile App
        ↓
Organization ID + Branch ID
        ↓
Custom Brand Configuration
        ↓
Backend API
        ↓
Cloud Kitchen Management System
```

Each organization can have:

- Different branding
- Different themes/styles
- Different menus
- Different subscription bundles
- Different kitchen branches

---

# ✨ Features

## 🔐 Authentication System

- Customer registration
- Email + password login
- OTP email verification
- JWT authentication
- Persistent login sessions

Only verified users are allowed to access the platform.

---

## ⚠️ Developer Note

SMTP services are disabled on Render's free tier deployment.

For demo/testing purposes, the OTP is displayed directly inside the application UI instead of being sent through email.

```text
⚠️ Developer Note:
SMTP services are disabled on Render's free tier.
For this demo, the OTP is displayed directly in the UI for testing purposes.

This application is a technical showcase and is not intended for production use.
```

---

# 🥗 Bundle & Subscription System

After login, customers can:

- Browse available meal bundles
- View weekly subscription plans
- Check detailed nutrition information
- View calorie breakdowns
- See serving size details
- Preview weekly menus

Example bundle structure:

```text
Bundle
 ├── Week Menu
 │    ├── Monday Meal - Calories 1000 , Nutrition Info
 │    ├── Tuesday Meal
 │    ├── Wednesday Meal
 │    ├── Thursday Meal
 │    └── Friday Meal
 │
 ├── Serving Details
 └── Subscription Pricing
```

---

# 🛒 Subscription Purchase Flow

```text
1. Register Account
        ↓
2. Verify OTP
        ↓
3. Login
        ↓
4. Browse Bundles
        ↓
5. View Nutrition & Menu Details
        ↓
6. Select Address
        ↓
7. Complete Payment
        ↓
8. Subscription Added to Account
        ↓
9. Kitchen Admin Approval
        ↓
10. Delivery Process Starts
```

---

# 🚚 Delivery Tracking

Once the kitchen admin approves the order, customers can track their meals in real time.

Delivery stages include:

```text
Order Received
      ↓
Preparing
      ↓
Ready for Pickup
      ↓
Picked Up
      ↓
Out for Delivery
      ↓
Delivered
```

The app provides live status updates throughout the delivery workflow.

---

# 🧑‍🍳 Cloud Kitchen Sync

The mobile application automatically syncs with the cloud kitchen system:

- Live menu updates
- Subscription availability
- Order approvals
- Delivery status changes
- Bundle updates
- Nutrition information

All customer purchases are instantly reflected in the kitchen management dashboard.

---

# 🎨 Customizable Branding System

The app supports dynamic branding configuration.

Businesses can customize:

- App colors/themes
- Logos
- Brand identity
- Menu structure
- Bundle offerings
- Organization-specific UI

This allows the same application architecture to support multiple cloud kitchen brands.

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native |
| Platform | Expo |
| Navigation | Expo Router |
| State Management | React Context / Zustand |
| API Client | Axios , Tanstack Query |
| Authentication | JWT |
| Backend | Node.js + Express |
| Database | MongoDB |
| Styling | Custom UI |

---

# 🚀 Installation

## Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI
- Real device or emulator like Android Studio or Xcode to run

---

## Clone Repository

```bash
git clone https://github.com/ajardeen/LunchboxLegendsMobile.git
cd LunchboxLegendsMobile
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npx expo start
```

---

## Run on Android

```bash
npx expo run:android
```

---

## Run on iOS

```bash
npx expo run:ios
```

---

# 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SOCKET_URL=

EXPO_PUBLIC_ORGANIZATION_ID=
EXPO_PUBLIC_BRANCH_ID=
```

---

# 📦 Related Repositories

| Repository | Description | Link |
|---|---|---|
| `lbl_business_portal` | Business portal frontend (Vite + React) | [GitHub](https://github.com/ajardeen/lbl_business_portal) |
| `LunchBox` | Marketing landing page | [GitHub](https://github.com/ajardeen/LunchBox) |
| `vabook_backend` | REST API + WebSocket backend | [GitHub](https://github.com/ajardeen/vabook_backend) |

---

# 📸 Core Modules

- Authentication
- OTP Verification
- Address Management
- Bundle Listing
- Nutrition Viewer
- Weekly Menu Viewer
- Subscription Management
- Order Tracking
- Delivery Tracking
- Profile Management

---

# 📌 Project Status

This project is currently a technical showcase / portfolio project demonstrating:

- Multi-tenant SaaS architecture
- Cloud kitchen workflow systems
- Real-time food delivery tracking
- Subscription-based commerce systems
- React Native + Expo ecosystem integration

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---



<div align="center">

Made with ❤️ by [Ajardeen](https://github.com/ajardeen)

⭐ **Star this repo if you found it helpful!** ⭐

</div>