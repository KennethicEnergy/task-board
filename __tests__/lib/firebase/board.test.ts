import {
  createCategory,
  updateCategory,
  createTask,
  updateTask,
  addHistoryEntry,
} from '@/lib/firebase/board';

// Mock Firebase
jest.mock('@/lib/firebase/config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn((db, collection, id) => ({ id, path: `${collection}/${id}` })),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn(),
  })),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((date) => ({ toDate: () => date })),
  },
  onSnapshot: jest.fn(),
}));

describe('Firebase Board Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have createCategory function', () => {
    expect(typeof createCategory).toBe('function');
  });

  it('should have updateCategory function', () => {
    expect(typeof updateCategory).toBe('function');
  });

  it('should have createTask function', () => {
    expect(typeof createTask).toBe('function');
  });

  it('should have updateTask function', () => {
    expect(typeof updateTask).toBe('function');
  });

  it('should have addHistoryEntry function', () => {
    expect(typeof addHistoryEntry).toBe('function');
  });
});
