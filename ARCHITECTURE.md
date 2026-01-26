# Architecture Documentation

## Overview

This document describes the architecture and design decisions for the Task Board application.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Testing**: Jest + React Testing Library

## Architecture Patterns

### 1. Component Structure

```
components/
├── auth/          # Authentication UI components
├── board/         # Board-related components
├── layout/        # Layout components
└── modals/        # Modal dialogs
```

**Design Principles**:
- Single Responsibility Principle
- Composition over inheritance
- Reusable, testable components
- Clear prop interfaces

### 2. State Management

**Context Providers**:
- `AuthContext`: Manages user authentication state
- `BoardContext`: Manages board data (categories, tasks, priorities, history)

**Benefits**:
- Centralized state management
- Easy to test and debug
- No external dependencies
- Type-safe with TypeScript

### 3. Custom Hooks

**Hook Pattern**:
- `useDragAndDrop`: Encapsulates drag-and-drop logic
- `useDraftSaving`: Handles auto-save functionality
- `useExpiryNotifications`: Manages expiry notifications

**Benefits**:
- Reusable logic
- Separation of concerns
- Easy to test independently

### 4. Firebase Integration

**Service Layer**:
- `lib/firebase/config.ts`: Firebase initialization
- `lib/firebase/auth.ts`: Authentication operations
- `lib/firebase/users.ts`: User data operations
- `lib/firebase/board.ts`: Board data operations

**Real-time Updates**:
- Uses Firestore `onSnapshot` for live data synchronization
- Automatic re-rendering when data changes
- Optimistic UI updates

### 5. Drag-and-Drop Implementation

**Custom HTML5 API**:
- No external libraries (as per requirements)
- Uses native `dragstart`, `dragover`, `drop` events
- Smooth user experience with visual feedback
- Supports:
  - Category reordering
  - Task movement between categories
  - Priority changes via drop zones

### 6. Draft Saving

**Auto-save Mechanism**:
- Debounced saves (1 second delay)
- Saves to Firestore `draft` field
- Preserves user work on interruption
- Visual indicator when draft exists

### 7. Notification System

**Multi-method Notifications**:
- Visual indicators (badges, colors)
- Toast notifications
- Configurable timing (days + hours before expiry)
- User preferences stored in Firestore

### 8. History Tracking

**Dual-level History**:
- Board-level: Category operations, sorting
- Card-level: Task edits, moves, priority changes
- Stored in Firestore with timestamps
- Viewable in History modal

## File Organization

### Type Definitions (`types/`)
- Centralized TypeScript interfaces
- Shared across the application
- Type-safe data structures

### Utilities (`utils/`)
- Pure functions
- Date manipulation
- Helper functions
- No side effects

### Tests (`__tests__/`)
- Unit tests for utilities
- Component tests
- Hook tests
- Integration tests

## Code Quality

### TypeScript
- Strict mode enabled
- No `any` types
- Comprehensive type coverage
- Interface-driven development

### Code Splitting
- Next.js automatic code splitting
- Route-based splitting
- Component lazy loading where appropriate

### Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Toast notifications for errors
- Graceful degradation

### Performance Optimizations
- React.memo for expensive components
- useCallback for event handlers
- useMemo for computed values
- Efficient re-renders

## Security Considerations

1. **Authentication**: Firebase handles secure authentication
2. **Authorization**: User-scoped data queries
3. **Input Validation**: Client and server-side validation
4. **Environment Variables**: Sensitive data in .env files
5. **XSS Prevention**: React's built-in escaping

## Testing Strategy

1. **Unit Tests**: Utilities and pure functions
2. **Component Tests**: UI components with React Testing Library
3. **Hook Tests**: Custom hooks in isolation
4. **Integration Tests**: Context providers and services
5. **E2E Ready**: Structure supports end-to-end testing

## Deployment

### Docker
- Multi-stage build for optimization
- Production-ready configuration
- Environment variable support
- Minimal image size

### Environment Variables
- Firebase configuration
- Feature flags (if needed)
- API endpoints (if needed)

## Scalability Considerations

1. **Firestore**: Handles scaling automatically
2. **Component Architecture**: Easy to extend
3. **State Management**: Can migrate to Redux if needed
4. **Code Splitting**: Reduces initial bundle size
5. **Caching**: Firestore client-side caching

## Future Enhancements

1. **Offline Support**: Service workers for PWA
2. **Real-time Collaboration**: Multi-user editing
3. **Advanced Filtering**: Search and filter tasks
4. **Export/Import**: Data portability
5. **Themes**: Dark mode and customization
