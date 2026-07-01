import { waitFor, screen, render } from '@/__test__/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SignIn } from './sign-in';

const mockPush = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    replace: mockPush,
  }),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: {
      email: 'test@example.com',
      uid: 'fake-uid-123',
      getIdToken: vi.fn().mockResolvedValue('fake-jwt-token'),
    },
  }),
}));

describe('SignIn Component ', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' }),
    });
  });

  it('should successfully submit the form with valid data', async () => {
    const { user } = render(<SignIn />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123!');

    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'fake-jwt-token' }),
      });

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should show validation errors if fields are empty', async () => {
    const { user } = render(<SignIn />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(screen.getByRole('textbox', { name: /email/i })).toHaveClass('input-error');
    expect(screen.getByRole('textbox', { name: /password/i })).toHaveClass('input-error');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('should show an error about invalid email format', async () => {
    const { user } = render(<SignIn />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email-format');
    await user.click(submitButton);

    const emailError = await screen.findByText('Must be a valid email');
    expect(emailError).toBeInTheDocument();
  });

  it('should check complex password validation (Unicode and special characters)', async () => {
    const { user } = render(<SignIn />);

    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

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
});
