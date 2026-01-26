import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/context/AuthContext';
import { BoardProvider } from '@/context/BoardContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BoardProvider>{children}</BoardProvider>
  </AuthProvider>
);

describe('LoginForm', () => {
  it('should render login form', () => {
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should require email and password', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailInput.validity.valueMissing).toBe(true);
    });
  });

  it('should allow user to type email and password', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
