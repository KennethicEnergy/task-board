# Task Board - Techlint Senior Frontend Developer Exam

A comprehensive task management board application built with Next.js, TypeScript, and Firebase. This application demonstrates professional frontend development practices including custom drag-and-drop functionality, real-time data synchronization, draft auto-saving, expiry notifications, and comprehensive update history tracking.

## Features

### Core Functionality

- **Authentication**: User registration and login using Firebase Authentication
- **Task Management**: Create, edit, and delete tasks with rich metadata
- **Category Management**: Organize tasks into customizable categories/labels
- **Priority System**: Fully customizable priority levels with visual indicators
- **Drag-and-Drop**: Custom implementation using HTML5 Drag and Drop API (no external libraries)
  - Drag categories to reorder
  - Drag tasks between categories
  - Drag tasks to change priority
- **Draft Saving**: Auto-save task drafts when editing is interrupted
- **Expiry Notifications**: Configurable notifications for tasks approaching expiration
  - Visual indicators (badges, color changes)
  - Toast notifications
  - Customizable notification timing
- **Update History**: Comprehensive tracking of all changes
  - Board-level history (category creation, sorting)
  - Card-level history (task edits, moves, priority changes)

### Technical Highlights

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Database**: Firebase Firestore (serverless)
- **Authentication**: Firebase Auth
- **Testing**: Jest with React Testing Library
- **Containerization**: Docker support included

## Project Structure

```
techlint-exam/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── board/             # Board-related components
│   ├── layout/            # Layout components
│   └── modals/            # Modal components
├── context/               # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── BoardContext.tsx  # Board state management
├── hooks/                 # Custom React hooks
│   ├── useDragAndDrop.ts # Drag-and-drop logic
│   ├── useDraftSaving.ts # Draft auto-save
│   └── useExpiryNotifications.ts # Expiry notifications
├── lib/                   # Library code
│   └── firebase/          # Firebase services
│       ├── config.ts     # Firebase configuration
│       ├── auth.ts       # Authentication functions
│       ├── users.ts      # User management
│       └── board.ts      # Board data operations
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── __tests__/             # Test files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # This file
```

## Installation

### Prerequisites

- Node.js 20+ and npm
- Firebase project (for production)
- Docker (optional, for containerized deployment)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd techlint-exam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase setup instructions
   - Quick steps:
     - Create Firebase project
     - Enable Authentication (Email/Password)
     - Create Firestore database
     - Configure security rules (see FIREBASE_SETUP.md)
     - Create required indexes (or let Firebase auto-create them)
     - Copy Firebase configuration values

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Categories**: Click "Add Category" to create your first category
3. **Create Tasks**: Click "Add Task" to create tasks and assign them to categories
4. **Drag and Drop**: 
   - Drag categories horizontally to reorder
   - Drag tasks between categories to move them
   - Drag tasks to priority areas to change priority
5. **Edit Tasks**: Click on any task card to edit its details
6. **Configure Notifications**: Access Settings to customize expiry notification preferences
7. **View History**: Click "History" to see all board and task updates

### Key Features Usage

- **Draft Saving**: When editing a task, drafts are automatically saved every second. If you close the modal without saving, your draft will be preserved.
- **Expiry Notifications**: Set expiry dates on tasks and configure notification settings to receive alerts before tasks expire.
- **Priority Management**: Tasks can be assigned to custom priority levels with color coding.
- **Update History**: All changes are tracked and can be viewed in the History modal.

## Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Deployment

### Vercel Deployment

1. **Push your code to GitHub/GitLab**
   ```bash
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel project settings, go to **Settings → Environment Variables** and add all Firebase configuration variables:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX (optional)
   ```
   
   **Important**: 
   - Make sure to add these for **Production**, **Preview**, and **Development** environments
   - After adding variables, you need to **redeploy** for changes to take effect

4. **Deploy**
   - Click "Deploy" or push a new commit to trigger automatic deployment
   - Wait for the build to complete

5. **Verify Deployment**
   - Once deployed, test account creation/login to ensure Firebase is configured correctly
   - Check Vercel logs if you encounter any errors

### Docker Deployment

### Prerequisites

Create a `.env` file in the project root with your Firebase configuration (see `.env.example`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Build and Run

1. **Build the Docker image**
   ```bash
   docker build -t task-board .
   ```
   
   Or with build arguments directly:
   ```bash
   docker build \
     --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key \
     --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
     --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id \
     --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com \
     --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 \
     --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id \
     -t task-board .
   ```

2. **Run with Docker Compose** (recommended)
   ```bash
   docker-compose up -d
   ```
   
   Docker Compose will automatically read from your `.env` file.

3. **Or run directly**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key \
     -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
     -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id \
     -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com \
     -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 \
     -e NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id \
     task-board
   ```

4. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Important Notes

- **Build-time variables**: Firebase `NEXT_PUBLIC_*` variables are required at build time, so they must be passed as build arguments (`--build-arg`) when building the image.
- **Runtime variables**: They're also needed at runtime, so they must be set as environment variables when running the container.
- **Docker Compose**: Automatically handles both build args and runtime env vars from your `.env` file.

## Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js recommended rules
- **Code Splitting**: Automatic code splitting via Next.js
- **Component Architecture**: Modular, reusable components
- **Error Handling**: Comprehensive error handling throughout
- **Performance**: Optimized with React best practices

## Unique Features

This implementation stands out with:

1. **Custom Drag-and-Drop**: Built from scratch using HTML5 API, no external dependencies
2. **Real-time Synchronization**: Live updates using Firebase Firestore listeners
3. **Intelligent Draft Saving**: Auto-save with debouncing to prevent data loss
4. **Comprehensive History**: Dual-level history tracking (board and card)
5. **Configurable Notifications**: Flexible notification system with multiple methods
6. **Professional Architecture**: Clean separation of concerns, scalable structure
7. **Full TypeScript**: End-to-end type safety
8. **Test Coverage**: Comprehensive test suite

## Development Process

This project follows Git best practices:
- Feature branches for each major feature
- Meaningful commit messages
- Incremental development with visible progress
- Clean, maintainable code structure

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Firebase**: Authentication and Firestore database
- **React Hot Toast**: Toast notifications
- **date-fns**: Date manipulation utilities
- **Jest & React Testing Library**: Testing framework

## License

This project is created for the Techlint Senior Frontend Developer practical exam.

## Contact

For questions or issues, please contact: info@techlint.com
