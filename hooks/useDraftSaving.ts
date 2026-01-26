import { useEffect, useRef, useCallback } from 'react';
import { TaskDraft } from '@/types';

const DRAFT_SAVE_DELAY = 1000;

export const useDraftSaving = (
  draft: TaskDraft | null,
  onSave: (draft: TaskDraft) => void,
  enabled: boolean = true
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string | null>(null);

  const saveDraft = useCallback(
    (newDraft: TaskDraft) => {
      const draftKey = JSON.stringify(newDraft);
      if (draftKey === lastSavedRef.current) return;

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
