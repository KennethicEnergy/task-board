# Vercel Deployment Troubleshooting

## Common Issue: Firebase API Key Error

If you're getting: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

### Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Verify ALL of these variables exist:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 2: Check Environment Selection

For EACH variable, make sure you've selected:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

**This is critical!** If you only selected "Production", preview deployments won't work.

### Step 3: Verify Variable Values

1. Double-check that values match your Firebase project exactly
2. No extra spaces or quotes around values
3. Values are case-sensitive

To get your Firebase config:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ → **Project Settings**
4. Scroll to **"Your apps"** → Click your web app
5. Copy values from the `firebaseConfig` object

### Step 4: Redeploy After Adding Variables

**IMPORTANT**: After adding or updating environment variables:
1. Go to **Deployments** tab
2. Click the **"⋯"** menu on your latest deployment
3. Click **"Redeploy"**
4. Wait for the build to complete

**Why?** Environment variables are embedded at build time. You must rebuild for changes to take effect.

### Step 5: Check Build Logs

1. Go to your deployment in Vercel
2. Click on the deployment
3. Check the **Build Logs** tab
4. Look for any errors or warnings about environment variables

### Step 6: Verify in Browser Console

1. Open your deployed app
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for Firebase initialization errors
5. The new code will show helpful error messages if env vars are missing

## Still Not Working?

### Option 1: Delete and Re-add Variables

Sometimes Vercel caches variables. Try:
1. Delete all Firebase environment variables
2. Add them again one by one
3. Make sure to select all environments
4. Redeploy

### Option 2: Check Variable Names

Make sure variable names are EXACTLY:
- `NEXT_PUBLIC_FIREBASE_API_KEY` (not `FIREBASE_API_KEY` or `NEXT_PUBLIC_API_KEY`)
- All must start with `NEXT_PUBLIC_` for client-side access

### Option 3: Test Locally First

1. Create `.env.local` with your Firebase config
2. Run `npm run build` locally
3. If it works locally but not on Vercel, it's a Vercel configuration issue

### Option 4: Check Firebase Project Settings

1. Verify your Firebase project is active
2. Check that Authentication is enabled
3. Verify API key restrictions (if any) allow your Vercel domain

## Quick Checklist

- [ ] All 6 Firebase env vars added to Vercel
- [ ] Each variable selected for Production, Preview, AND Development
- [ ] Variable values match Firebase Console exactly
- [ ] No extra spaces/quotes in values
- [ ] Redeployed after adding variables
- [ ] Checked browser console for specific errors
- [ ] Verified Firebase project is active

## Getting Help

If still stuck:
1. Check Vercel deployment logs
2. Check browser console errors
3. Verify Firebase project settings
4. Try creating a new Vercel project and redeploying
