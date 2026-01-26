import { renderHook, act, waitFor } from '@testing-library/react';
import { BoardProvider, useBoard } from '@/context/BoardContext';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <BoardProvider>{children}</BoardProvider>
  </AuthProvider>
);

describe('BoardContext', () => {
  it('should provide board context', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.categories).toEqual([]);
    expect(result.current.tasks).toEqual([]);
    expect(result.current.priorities).toBeDefined();
  });

  it('should have createCategory function', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    
    expect(typeof result.current.createCategory).toBe('function');
  });

  it('should have createTask function', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    
    expect(typeof result.current.createTask).toBe('function');
  });
});
