import * as v from 'valibot';

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.nonEmpty('required_email'), v.email('invalid_email')),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'min_length:8'),
    v.regex(/\p{L}/u, 'one_letter'),
    v.regex(/\p{N}/u, 'one_number'),
    v.regex(/[\p{P}\p{S}]/u, 'one_special')
  ),
});

export const registerSchema = v.pipe(
  v.object({
    ...loginSchema.entries,
    username: v.pipe(
      v.string('required_username'),
      v.trim(),
      v.nonEmpty('required_username'),
      v.maxLength(8, 'max_length:8')
    ),
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
