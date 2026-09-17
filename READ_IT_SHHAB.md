# Firebase Setup Guide for Shhab

This guide explains how to connect the birthday website to Firebase Realtime Database. 
This feature allows any visitor who inspects the Developer Console (F12) to instantly see incoming birthday messages in real-time from other visitors.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Log in with your Google account.
3. Click **Add project** (or Create a project).
4. Name the project (e.g., "Layal-Birthday").
5. You can disable Google Analytics for this project.
6. Click **Create project**.

## Step 2: Add a Web App
1. In your new project dashboard, click the **Web icon** (`</>`) to add Firebase to your web app.
2. Register the app with a nickname.
3. Click **Register app**.

## Step 3: Copy Firebase Configuration
Firebase will generate a `firebaseConfig` object for you. It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
Copy these keys!

## Step 4: Add Config to the Code
Open the project code and find this file:
`src/firebase-config.ts`

Paste your generated keys into the empty `firebaseConfig` object in that file.

## Step 5: Enable Realtime Database
1. Go back to the Firebase Console menu on the left.
2. Click **Build** > **Realtime Database**.
3. Click **Create Database**.
4. Choose your preferred location and click Next.
5. Start in **Locked mode** for now.

## Step 6: Configure Public Security Rules
Since this feature is designed to be fully public without any user logins or authentication, you need to open the database rules.
**IMPORTANT:** Because anonymous public read/write access is required for this feature, the messages are intentionally public. Anyone capable of inspecting the frontend can interact with the Firebase endpoint directly. This is acceptable for this project.

1. Click the **Rules** tab in the Realtime Database dashboard.
2. Replace the rules with the following simple configuration:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Click **Publish**.

## Step 7: Deploy the Website
Run the build command and deploy your website to GitHub Pages:
```bash
npm run build
```
Push the changes to GitHub and enable GitHub pages.

## Step 8: Test the Real-time System
You will need two devices (or two separate browser windows).

### Device A
1. Open the deployed website.
2. Go through the experience until you reach the final private message scene.
3. Type a message and submit it.

### Device B
1. Open the deployed website.
2. Press **F12** on your keyboard (or right-click -> Inspect).
3. Select the **Console** tab.
4. Keep the Console open.

**The Test:**
When Device A clicks submit, Device B's Console should immediately display:
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💌 NEW BIRTHDAY MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Message: ...
🕐 Time: ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
**No refresh is required!** 
The system works by keeping a real-time invisible connection active on every visitor's browser. If 10 people have the website open, all 10 browsers will receive the message instantly.
