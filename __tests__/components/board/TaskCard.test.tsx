import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/board/TaskCard';
import { Task, Priority } from '@/types';
import { AuthProvider } from '@/context/AuthContext';
import { BoardProvider } from '@/context/BoardContext';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  categoryId: 'cat-1',
  priorityId: 'pri-1',
  expiryDate: null,
  draft: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-1',
  order: 0,
};

const mockPriority: Priority = {
  id: 'pri-1',
  label: 'High',
  color: '#ef4444',
  level: 'high',
  order: 0,
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BoardProvider>{children}</BoardProvider>
  </AuthProvider>
);

describe('TaskCard', () => {
  it('should render task title', () => {
    render(
      <Wrapper>
        <TaskCard task={mockTask} priority={mockPriority} onEdit={jest.fn()} />
      </Wrapper>
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(
      <Wrapper>
        <TaskCard task={mockTask} priority={mockPriority} onEdit={jest.fn()} />
      </Wrapper>
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render priority label', () => {
    render(
      <Wrapper>
        <TaskCard task={mockTask} priority={mockPriority} onEdit={jest.fn()} />
      </Wrapper>
    );
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should handle click to edit', () => {
    const onEdit = jest.fn();
    render(
      <Wrapper>
        <TaskCard task={mockTask} priority={mockPriority} onEdit={onEdit} />
      </Wrapper>
    );

    const card = screen.getByText('Test Task').closest('div');
    card?.click();
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });
});
