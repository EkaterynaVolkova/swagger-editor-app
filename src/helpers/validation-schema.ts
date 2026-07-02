import * as v from 'valibot';

export const loginSchema = v.object({
  email: v.pipe(
    v.string('required_email'),
    v.trim(),
    v.nonEmpty('required_email'),
    v.email('invalid_email')
  ),
  password: v.pipe(
    v.string('required_password'),
    v.minLength(8, 'min_length'),
    v.regex(/\p{L}/u, 'one_letter'),
    v.regex(/\p{N}/u, 'one_number'),
    v.regex(/[\p{P}\p{S}]/u, 'one_special')
  ),
});

export const registerSchema = v.pipe(
  v.object({
    ...loginSchema.entries,
    confirmPassword: v.string('required_password'),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'not_matched'
    ),
    ['confirmPassword']
  )
);

export type LoginFormData = v.InferOutput<typeof loginSchema>;
export type RegisterFormData = v.InferOutput<typeof registerSchema>;
