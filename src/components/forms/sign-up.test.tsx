import { waitFor, screen, render } from '@/__test__/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SignUp } from './sign-up';

const mockPush = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    replace: mockPush,
  }),
}));

describe('SignIn Component ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit the form with valid data', async () => {
    const { user } = render(<SignUp />);

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: 'Password' });
    const confirmPasswordInput = screen.getByRole('textbox', { name: 'Confirm password' });
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'Anon');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123!');
    await user.type(confirmPasswordInput, 'password123!');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should show validation errors if fields are empty', async () => {
    const { user } = render(<SignUp />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    expect(screen.getByRole('textbox', { name: /email/i })).toHaveClass('input-error');
    expect(screen.getByRole('textbox', { name: /username/i })).toHaveClass('input-error');
    expect(screen.getByRole('textbox', { name: 'Password' })).toHaveClass('input-error');

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('should show an error about invalid email format', async () => {
    const { user } = render(<SignUp />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'invalid-email-format');
    await user.click(submitButton);

    const emailError = await screen.findByText('Must be a valid email');
    expect(emailError).toBeInTheDocument();
  });

  it('should show an error about long username', async () => {
    const { user } = render(<SignUp />);

    const emailInput = screen.getByRole('textbox', { name: /username/i });
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'invalid-username-format');
    await user.click(submitButton);

    const emailError = await screen.findByText('The username must not be longer than 8 characters');
    expect(emailError).toBeInTheDocument();
  });

  it('should check complex password validation (Unicode and special characters)', async () => {
    const { user } = render(<SignUp />);

    const passwordInput = screen.getByRole('textbox', { name: 'Password' });
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(passwordInput, '123');
    await user.click(submitButton);
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();

    await user.clear(passwordInput);

    await user.type(passwordInput, '12345678!!!');
    await user.click(submitButton);
    expect(
      await screen.findByText('Password must contain at least one letter')
    ).toBeInTheDocument();

    await user.clear(passwordInput);

    await user.type(passwordInput, 'пароль123');
    await user.click(submitButton);
    expect(
      await screen.findByText('Password must contain at least one special character')
    ).toBeInTheDocument();
  });

  it("should display error if passwords doen't match", async () => {
    const { user } = render(<SignUp />);

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: 'Password' });
    const confirmPasswordInput = screen.getByRole('textbox', { name: 'Confirm password' });
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'Anon');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123!');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    expect(screen.getByText(`The passwords don't match`)).toBeInTheDocument();
  });
});
