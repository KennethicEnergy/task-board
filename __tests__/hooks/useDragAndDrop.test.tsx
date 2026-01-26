import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

describe('useDragAndDrop', () => {
  const mockOnTaskDrop = jest.fn();
  const mockOnCategoryDrop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null drag state', () => {
    const { result } = renderHook(() => useDragAndDrop());
    expect(result.current.dragState.type).toBeNull();
    expect(result.current.dragState.id).toBeNull();
  });

  it('should handle drag start', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockDataTransfer = {
      effectAllowed: '',
      setData: jest.fn(),
    };
    const mockEvent = {
      dataTransfer: mockDataTransfer,
      preventDefault: jest.fn(),
    } as unknown as React.DragEvent<HTMLDivElement>;

    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: mockDataTransfer,
      writable: true,
    });

    act(() => {
      result.current.handleDragStart(mockEvent, 'task', 'task-1', { title: 'Test' });
    });

    expect(result.current.dragState.type).toBe('task');
    expect(result.current.dragState.id).toBe('task-1');
  });

  it('should handle drag over', () => {
    const { result } = renderHook(() => useDragAndDrop({ onTaskDrop: mockOnTaskDrop }));
    const mockDataTransfer = {
      effectAllowed: '',
      setData: jest.fn(),
      dropEffect: '',
    };
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: mockDataTransfer,
    } as unknown as React.DragEvent<HTMLDivElement>;

    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: mockDataTransfer,
      writable: true,
    });

    act(() => {
      result.current.handleDragStart(mockEvent, 'task', 'task-1');
    });

    act(() => {
      result.current.handleDragOver(mockEvent, 'category-1');
    });

    expect(result.current.draggedOver).toBe('category-1');
  });

  it('should handle drop', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onTaskDrop: mockOnTaskDrop })
    );
    const mockDataTransfer = {
      effectAllowed: '',
      setData: jest.fn(),
    };
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: mockDataTransfer,
    } as unknown as React.DragEvent<HTMLDivElement>;

    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: mockDataTransfer,
      writable: true,
    });

    act(() => {
      result.current.handleDragStart(mockEvent, 'task', 'task-1');
    });

    act(() => {
      result.current.handleDrop(mockEvent, 'category-1', 0);
    });

    expect(mockOnTaskDrop).toHaveBeenCalledWith('task-1', 'category-1', 0);
    expect(result.current.dragState.id).toBeNull();
  });

  it('should not handle drag when disabled', () => {
    const { result } = renderHook(() => useDragAndDrop({ disabled: true }));
    const mockDataTransfer = {
      setData: jest.fn(),
    };
    const mockEvent = {
      dataTransfer: mockDataTransfer,
    } as unknown as React.DragEvent<HTMLDivElement>;

    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: mockDataTransfer,
      writable: true,
    });

    act(() => {
      result.current.handleDragStart(mockEvent, 'task', 'task-1');
    });

    expect(result.current.dragState.id).toBeNull();
  });
});
