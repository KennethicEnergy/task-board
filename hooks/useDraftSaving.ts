import { useEffect, useRef, useCallback } from 'react';
import { TaskDraft } from '@/types';

const DRAFT_SAVE_DELAY = 1000;

export const useDraftSaving = (
  draft: TaskDraft | null,
  onSave: (draft: TaskDraft) => void,
  enabled: boolean = true,
  taskId?: string | null
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const prevTaskIdRef = useRef<string | null>(null);

  // Reset baseline when editing a different task so we don't save on first load
  useEffect(() => {
    const id = taskId ?? null;
    if (id !== prevTaskIdRef.current) {
      prevTaskIdRef.current = id;
      lastSavedRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [taskId]);

  const saveDraft = useCallback(
    (newDraft: TaskDraft) => {
      const draftKey = JSON.stringify(newDraft);
      if (draftKey === lastSavedRef.current) return;

      // Initial load: treat current values as baseline, don't save or show toast
      if (lastSavedRef.current === null) {
        lastSavedRef.current = draftKey;
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSave(newDraft);
        lastSavedRef.current = draftKey;
      }, DRAFT_SAVE_DELAY);
    },
    [onSave]
  );

  useEffect(() => {
    if (!enabled || !draft) return;

    saveDraft(draft);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [draft, enabled, saveDraft]);

  const saveImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (draft) {
      onSave(draft);
      lastSavedRef.current = JSON.stringify(draft);
    }
  }, [draft, onSave]);

  return { saveImmediately };
};
