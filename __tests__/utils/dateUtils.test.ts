import {
  formatDate,
  formatDateTime,
  isExpired,
  isExpiringSoon,
  createExpiryDate,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('2024-01-15');
      expect(formatted).toContain('10:30');
    });

    it('should return empty string for null', () => {
      expect(formatDateTime(null)).toBe('');
    });
  });

  describe('isExpired', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isExpired(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(isExpired(futureDate)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isExpired(null)).toBe(false);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true when date is within threshold', () => {
      const now = new Date();
      // Set tomorrow to be 23 hours from now (within 1 day threshold)
      const tomorrow = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      expect(isExpiringSoon(tomorrow, 1, 0)).toBe(true);
    });

    it('should return false when date is beyond threshold', () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      expect(isExpiringSoon(nextWeek, 1, 0)).toBe(false);
    });
  });

  describe('createExpiryDate', () => {
    it('should create date with correct offset', () => {
      const date = createExpiryDate(5, 2);
      const now = new Date();
      const expected = new Date(now);
      expected.setDate(expected.getDate() + 5);
      expected.setHours(expected.getHours() + 2);

      expect(date.getTime()).toBeCloseTo(expected.getTime(), -3);
    });
  });
});
