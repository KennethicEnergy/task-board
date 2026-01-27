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

  it('should save draft after delay when draft changes from baseline', async () => {
    const { rerender } = renderHook(
      ({ draft }) => useDraftSaving(draft, mockOnSave, true, 'task-1'),
      { initialProps: { draft: mockDraft } }
    );

    // First draft is baseline, no save
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockOnSave).not.toHaveBeenCalled();

    // Change draft (user edit) then wait for debounce
    rerender({ draft: { ...mockDraft, title: 'Updated' } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({ ...mockDraft, title: 'Updated' });
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
