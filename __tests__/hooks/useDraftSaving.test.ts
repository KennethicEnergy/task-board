import { renderHook, act, waitFor } from '@testing-library/react';
import { useDraftSaving } from '@/hooks/useDraftSaving';
import { TaskDraft } from '@/types';

jest.useFakeTimers();

describe('useDraftSaving', () => {
  const mockOnSave = jest.fn();
  const mockDraft: TaskDraft = {
    title: 'Test',
    description: 'Description',
    expiryDate: null,
    priorityId: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should save draft after delay', async () => {
    renderHook(() => useDraftSaving(mockDraft, mockOnSave, true));

    expect(mockOnSave).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockDraft);
    });
  });

  it('should not save when disabled', () => {
    renderHook(() => useDraftSaving(mockDraft, mockOnSave, false));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should debounce rapid changes', () => {
    const { rerender } = renderHook(
      ({ draft }) => useDraftSaving(draft, mockOnSave, true),
      { initialProps: { draft: mockDraft } }
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ draft: { ...mockDraft, title: 'Updated' } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockOnSave).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });
});
