'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { createTranslatedResolver } from '@/helpers/translate-issues';
import { LoginFormData, loginSchema } from '@/helpers/validation-schema';

export function SignIn() {
  const tValidation = useTranslations('Validation');
  const tForm = useTranslations('Forms');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: createTranslatedResolver<LoginFormData>(loginSchema, tValidation),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Data', data);
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
      </fieldset>
      <button className="btn btn-success w-auto">{tForm('sign_up')}</button>
    </form>
  );
}
