import { z } from 'zod'

/** Error messages are i18n keys, translated when rendered */
export type AuthErrorKey =
  | 'auth.errors.usernameRequired'
  | 'auth.errors.usernameFormat'
  | 'auth.errors.passwordRequired'
  | 'auth.errors.passwordMin'
  | 'auth.errors.passwordStrength'
  | 'auth.errors.passwordMismatch'

const USERNAME_PATTERN = /^[a-zA-Z0-9._]{3,20}$/

const username = z
  .string()
  .trim()
  .min(1, 'auth.errors.usernameRequired' satisfies AuthErrorKey)
  .regex(USERNAME_PATTERN, 'auth.errors.usernameFormat' satisfies AuthErrorKey)

export const signInSchema = z.object({
  username,
  password: z.string().min(1, 'auth.errors.passwordRequired' satisfies AuthErrorKey),
})

export const signUpSchema = z
  .object({
    username,
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired' satisfies AuthErrorKey)
      .min(8, 'auth.errors.passwordMin' satisfies AuthErrorKey)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'auth.errors.passwordStrength' satisfies AuthErrorKey),
    confirmPassword: z.string().min(1, 'auth.errors.passwordRequired' satisfies AuthErrorKey),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.errors.passwordMismatch' satisfies AuthErrorKey,
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
