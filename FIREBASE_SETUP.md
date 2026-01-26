# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Task Board application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "task-board")
4. Follow the setup wizard:
   - Disable Google Analytics (optional, not required)
   - Click **"Create project"**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click on **"Sign-in method"** tab
3. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Click **"Save"**

## Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (we'll update security rules next)
3. Select a location (choose closest to your users)
4. Click **"Enable"**

## Step 4: Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can read/write their own document
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Categories collection - users can only access their own categories
    match /categories/{categoryId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Tasks collection - users can only access their own tasks
    match /tasks/{taskId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Priorities collection - users can only access their own priorities
    match /priorities/{priorityId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Update History collection - users can only access their own history
    match /updateHistory/{historyId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"** to save the rules

## Step 5: Create Firestore Indexes

The application uses composite indexes for efficient queries. Firebase will prompt you to create these when you first run queries, but you can create them manually:

### Required Indexes:

1. **Categories Index**
   - Collection: `categories`
   - Fields: `userId` (Ascending), `order` (Ascending)
   - Query scope: Collection

2. **Tasks Index**
   - Collection: `tasks`
   - Fields: `userId` (Ascending), `order` (Ascending)
   - Query scope: Collection

3. **Priorities Index**
   - Collection: `priorities`
   - Fields: `userId` (Ascending), `order` (Ascending)
   - Query scope: Collection

4. **History Index**
   - Collection: `updateHistory`
   - Fields: `userId` (Ascending), `timestamp` (Descending)
   - Query scope: Collection

### How to Create Indexes:

**Option 1: Automatic (Recommended)**
- When you run the app and perform operations, Firebase will show error messages with links to create the required indexes
- Click the links to create them automatically

**Option 2: Manual**
1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Create Index"**
3. Select the collection and fields as listed above
4. Click **"Create"**

## Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app:
   - App nickname: "Task Board Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**
5. Copy the Firebase configuration object (you'll see `const firebaseConfig = {...}`)

## Step 7: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

   Replace the values with the ones from your Firebase config object.

## Step 8: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Try to register a new account:
   - Click "Register"
   - Enter email and password
   - If successful, you should see the board interface

4. Check Firebase Console:
   - **Authentication**: Should show your new user
   - **Firestore Database**: Should show collections being created (`users`, `categories`, `tasks`, etc.)

## Troubleshooting

### Authentication Errors
- **"auth/email-already-in-use"**: Email is already registered
- **"auth/invalid-email"**: Email format is invalid
- **"auth/weak-password"**: Password must be at least 6 characters

### Firestore Errors
- **"Missing or insufficient permissions"**: Check security rules
- **"The query requires an index"**: Create the required index (Firebase will provide a link)
- **"Permission denied"**: Verify security rules allow the operation

### Configuration Errors
- **"Firebase: Error (auth/invalid-api-key)"**: Check your `.env.local` file
- **"Firebase: Error (auth/domain-not-authorized)"**: Add your domain to Firebase authorized domains

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment-specific configs** - Different configs for dev/staging/prod
3. **Review security rules regularly** - Ensure rules match your requirements
4. **Enable App Check** (optional) - For production, consider enabling Firebase App Check
5. **Monitor usage** - Check Firebase Console for unexpected activity

## Production Deployment

For production deployment:

1. **Update Security Rules**: Consider stricter rules for production
2. **Enable App Check**: Add additional security layer
3. **Set up Monitoring**: Enable Firebase Performance Monitoring
4. **Configure CORS**: If needed, configure CORS in Firebase Console
5. **Set up Backups**: Configure Firestore backups

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)

## Quick Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Indexes created (or will be auto-created)
- [ ] Firebase config copied
- [ ] `.env.local` file created and configured
- [ ] App tested (registration/login works)
- [ ] Data appears in Firestore

Once all steps are complete, your application should be fully functional!
