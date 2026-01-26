import { useState, useCallback, useRef, DragEvent } from 'react';

export type DragType = 'category' | 'task' | 'priority';

export interface DragState {
  type: DragType | null;
  id: string | null;
  data: unknown;
}

export interface UseDragAndDropOptions {
  onCategoryDrop?: (draggedId: string, targetId: string) => void;
  onTaskDrop?: (taskId: string, categoryId: string, order: number) => void;
  onPriorityDrop?: (taskId: string, priorityId: string) => void;
  disabled?: boolean;
}

export const useDragAndDrop = (options: UseDragAndDropOptions = {}) => {
  const [dragState, setDragState] = useState<DragState>({
    type: null,
    id: null,
    data: null,
  });
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragStart = useCallback(
    (e: DragEvent, type: DragType, id: string, data?: unknown) => {
      if (options.disabled) return;

      e.dataTransfer.effectAllowed = 'move';
      // Put identifiers into the drag payload so other drop targets can work
      // even if they don't share this hook instance.
      e.dataTransfer.setData('application/x-drag-type', type);
      e.dataTransfer.setData('application/x-drag-id', id);
      // Fallback for browsers that only expose text payload
      e.dataTransfer.setData('text/plain', id);
      setDragState({ type, id, data: data || null });
    },
    [options.disabled]
  );

  const handleDragOver = useCallback(
    (e: DragEvent, targetId: string) => {
      if (options.disabled || !dragState.id) return;

      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';

      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }

      setDraggedOver(targetId);

      dragOverTimeoutRef.current = setTimeout(() => {
        setDraggedOver(null);
      }, 100);
    },
    [dragState.id, options.disabled]
  );

  const handleDragLeave = useCallback(() => {
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }
    setDraggedOver(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent, targetId: string, order?: number, isPriorityZone?: boolean) => {
      if (options.disabled || !dragState.id || !dragState.type) return;

      e.preventDefault();
      e.stopPropagation();

      // If dropping a task on a priority zone, change priority
      if (dragState.type === 'task' && isPriorityZone && options.onPriorityDrop) {
        options.onPriorityDrop(dragState.id, targetId);
      } else if (dragState.type === 'category' && options.onCategoryDrop) {
        options.onCategoryDrop(dragState.id, targetId);
      } else if (dragState.type === 'task' && options.onTaskDrop) {
        options.onTaskDrop(dragState.id, targetId, order ?? 0);
      } else if (dragState.type === 'priority' && options.onPriorityDrop) {
        options.onPriorityDrop(dragState.id, targetId);
      }

      setDragState({ type: null, id: null, data: null });
      setDraggedOver(null);
    },
    [dragState, options]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ type: null, id: null, data: null });
    setDraggedOver(null);
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }
  }, []);

  return {
    dragState,
    draggedOver,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};
