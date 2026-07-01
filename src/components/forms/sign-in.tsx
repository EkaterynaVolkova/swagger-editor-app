'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';

import { auth } from '@/lib/firebase/client';
import { useRouter } from '@/i18n/navigation';
import { LoginFormData, loginSchema } from '@/helpers/validation-schema';
import { handleFirebaseError } from '@/helpers/handleFirebaseError';
import { setSessionCookie } from '@/lib/auth/set-session-cookie';

export function SignIn() {
  const router = useRouter();
  const tValidation = useTranslations('Validation');
  const tForm = useTranslations('Forms');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: valibotResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      await setSessionCookie(token);
      router.replace('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseError(error, setError);
      } else {
        setError('root', {
          type: 'manual',
          message: error instanceof Error ? error.message : 'unknown_error',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <fieldset className="fieldset">
        <label htmlFor="email" className="label text-foreground">
          {tForm('email')}
        </label>
        <input
          {...register('email')}
          id="email"
          type="text"
          className={`input w-auto ${errors.email ? 'input-error' : ''}`}
          placeholder="you@example.com"
        />
        <p className="label text-error h-4">
          {errors.email?.message && tValidation(errors.email.message)}
        </p>

        <label htmlFor="password" className="label text-foreground">
          {tForm('password')}
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className={`input w-auto ${errors.password ? 'input-error' : ''}`}
          placeholder="********"
        />
        <p className="label text-error h-4">
          {errors.password?.message && tValidation(errors.password.message, { length: 8 })}
        </p>
      </fieldset>
      <button className="btn btn-success w-auto" disabled={isSubmitting}>
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {tForm('sign_in')}
      </button>
      {errors.root && (
        <div className="alert alert-error my-2 p-3 text-sm shadow-sm">
          <svg className="h-5 w-5 shrink-0 stroke-current">
            <use href="/icons.svg#error-icon"></use>
          </svg>
          <span>{errors.root.message}</span>
        </div>
      )}
    </form>
  );
}
