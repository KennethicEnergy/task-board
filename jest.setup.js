import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./lib/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  app: {},
}));

jest.mock('./lib/firebase/auth', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  onAuthChange: jest.fn((callback) => {
    callback(null);
    return () => {};
  }),
  updateUserNotificationSettings: jest.fn(),
}));

jest.mock('./lib/firebase/board', () => ({
  subscribeToCategories: jest.fn(() => () => {}),
  subscribeToTasks: jest.fn(() => () => {}),
  subscribeToPriorities: jest.fn(() => () => {}),
  subscribeToHistory: jest.fn(() => () => {}),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  updateCategoryOrder: jest.fn(),
  deleteCategory: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  updateTaskOrder: jest.fn(),
  deleteTask: jest.fn(),
  createPriority: jest.fn(),
  updatePriority: jest.fn(),
  deletePriority: jest.fn(),
  addHistoryEntry: jest.fn(),
}));

jest.mock('./lib/firebase/users', () => ({
  getUserDocument: jest.fn(),
  createUserDocument: jest.fn(),
  updateUserDocument: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock next/font
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}));
