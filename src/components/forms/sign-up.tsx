'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { createTranslatedResolver } from '@/helpers/translate-issues';
import { RegisterFormData, registerSchema } from '@/helpers/validation-schema';

export function SignUp() {
  const tValidation = useTranslations('Validation');
  const tForm = useTranslations('Forms');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: createTranslatedResolver<RegisterFormData>(registerSchema, tValidation),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Data', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <fieldset className="fieldset">
        <label htmlFor="username" className="label text-foreground">
          {tForm('username')}
        </label>
        <input
          {...register('username')}
          id="username"
          type="text"
          className={`input w-auto ${errors.username ? 'input-error' : ''}`}
          placeholder={tForm('username_placeholder')}
        />
        <p className="label text-error h-4">{errors.username?.message}</p>
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
        <p className="label text-error h-4">{errors.email?.message}</p>

        <label htmlFor="password" className="label text-foreground">
          {tForm('password')}
        </label>
        <input
          {...register('password')}
          id="password"
          type="text"
          className={`input w-auto ${errors.password ? 'input-error' : ''}`}
          placeholder="********"
        />
        <p className="label text-error h-4">{errors.password?.message}</p>
        <label htmlFor="confirmPassword" className="label text-foreground">
          {tForm('confirm_password')}
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="text"
          className={`input w-auto ${errors.confirmPassword ? 'input-error' : ''}`}
          placeholder="********"
        />
        <p className="label text-error h-4">{errors.confirmPassword?.message}</p>
      </fieldset>
      <button className="btn btn-success w-auto">{tForm('sign_up')}</button>
    </form>
  );
}
