import { describe, expect, it, vi } from 'vitest';

import { handleFirebaseError } from './handleFirebaseError';

describe('handleFirebaseError', () => {
  it.each([
    ['auth/email-already-in-use', 'email', 'email_already_in_use'],
    ['auth/invalid-credential', 'password', 'invalid_credentials'],
    ['auth/user-not-found', 'password', 'invalid_credentials'],
    ['auth/wrong-password', 'password', 'invalid_credentials'],
    ['auth/too-many-requests', 'root', 'too_many_requests'],
    ['auth/other-error', 'root', 'Original Firebase message'],
  ])('maps %s to the form error field', (code, field, message) => {
    const setError = vi.fn();

    handleFirebaseError(
      { code, message: 'Original Firebase message', name: 'FirebaseError' },
      setError
    );

    expect(setError).toHaveBeenCalledWith(field, {
      type: 'manual',
      message,
    });
  });
});
