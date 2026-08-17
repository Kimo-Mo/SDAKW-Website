import { z } from 'zod';

export function buildChangePasswordSchema(t: (key: string) => string) {
  return z
    .object({
      currentPassword: z.string().min(1, t('changePassword.errors.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(8, t('changePassword.errors.passwordMinLength'))
        .regex(/[A-Z]/, t('changePassword.errors.passwordUppercase'))
        .regex(/[a-z]/, t('changePassword.errors.passwordLowercase'))
        .regex(/[0-9]/, t('changePassword.errors.passwordNumber')),
      confirmPassword: z.string().min(1, t('changePassword.errors.confirmPasswordRequired')),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: t('changePassword.errors.passwordSameAsCurrent'),
      path: ['newPassword'],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('changePassword.errors.passwordsMustMatch'),
      path: ['confirmPassword'],
    });
}

export type ChangePasswordFormSchema = ReturnType<typeof buildChangePasswordSchema>;
export type ChangePasswordFormValues = z.infer<ChangePasswordFormSchema>;
