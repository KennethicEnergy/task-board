# Vercel Deployment Guide

This guide will help you deploy the Task Board application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Firebase project configured (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

## Step-by-Step Deployment

### Step 1: Push Code to Repository

Make sure your code is pushed to your Git repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

**This is the most important step!** Without these, you'll get Firebase API key errors.

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add each of the following variables:

   | Variable Name | Value | Example |
   |--------------|-------|---------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyC7U56w_H1uDgko08Gv4NrhY28x2bod9WI` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Auth Domain | `techlint-exam.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Project ID | `techlint-exam` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Storage Bucket | `techlint-exam.appspot.com` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | `586980193418` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | Your App ID | `1:586980193418:web:762737f9f2dc8f62652973` |
   | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your Measurement ID (optional) | `G-TF4TMXGBVH` |

3. **Important**: For each variable, select all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **"Save"** after adding each variable

### Step 4: Get Firebase Configuration Values

If you don't have your Firebase config values:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **"Your apps"** section
5. Click on your web app (or create one if you haven't)
6. Copy the values from the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "your-project",     // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",   // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123", // → NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX"   // → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)
};
```

### Step 5: Deploy

1. After adding all environment variables, go back to the **Deployments** tab
2. Click **"Redeploy"** on your latest deployment (or push a new commit)
3. Wait for the build to complete

### Step 6: Verify Deployment

1. Once deployed, click on your deployment URL
2. Try to **register a new account**
3. If you see the error: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`
   - Go back to Vercel Settings → Environment Variables
   - Verify all variables are set correctly
   - Make sure you selected all environments (Production, Preview, Development)
   - Click **"Redeploy"** after fixing

## Troubleshooting

### Error: "auth/api-key-not-valid"

**Cause**: Environment variables are not set or incorrect in Vercel.

**Solution**:
1. Double-check all environment variables in Vercel Settings
2. Make sure variable names start with `NEXT_PUBLIC_` (required for client-side access)
3. Verify values match your Firebase project settings
4. Redeploy after adding/updating variables

### Error: "auth/domain-not-authorized"

**Cause**: Your Vercel domain is not authorized in Firebase.

**Solution**:
1. Go to Firebase Console → Authentication → Settings
2. Scroll to **"Authorized domains"**
3. Add your Vercel domain (e.g., `your-project.vercel.app`)
4. Also add your custom domain if you have one

### Build Fails

**Common causes**:
- Missing environment variables
- TypeScript errors
- Build timeout

**Solution**:
1. Check Vercel build logs for specific errors
2. Run `npm run build` locally to catch errors early
3. Ensure all dependencies are in `package.json`

### Environment Variables Not Working

**Important Notes**:
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- After adding/updating variables, you **must redeploy** for changes to take effect
- Variables are case-sensitive
- Make sure you've selected the correct environments (Production, Preview, Development)

## Additional Configuration

### Custom Domain

1. In Vercel, go to **Settings → Domains**
2. Add your custom domain
3. Update Firebase Authorized Domains with your custom domain

### Firebase Security Rules

Make sure your Firestore security rules allow access from your Vercel domain. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for security rules configuration.

## Need Help?

If you're still experiencing issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Firebase project settings
4. Ensure all environment variables are correctly set
