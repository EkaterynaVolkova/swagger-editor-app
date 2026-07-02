import { UseFormSetError } from 'react-hook-form';
import { LoginFormData, RegisterFormData } from './validation-schema';
import { FirebaseError } from 'firebase/app';

export function handleFirebaseError(
  error: FirebaseError,
  setError: UseFormSetError<RegisterFormData | LoginFormData>
) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      setError('email', {
        type: 'manual',
        message: 'email_already_in_use',
      });
      break;

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      setError('password', {
        type: 'manual',
        message: 'invalid_credentials',
      });
      break;

    case 'auth/too-many-requests':
      setError('root', {
        type: 'manual',
        message: 'too_many_requests',
      });
      break;

    default:
      setError('root', {
        type: 'manual',
        message: error.message,
      });
      break;
  }
}
