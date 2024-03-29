import { z } from 'zod';

export class UserValidator {
  private createUserSchema = z
    .object({
      firstName: z
        .string()
        .min(1, 'First name is required.')
        .max(20, 'First name must be at most 20 characters.')
        .refine((val) => val.trim().length > 0, {
          message: 'First name cannot be just white spaces.',
        }),
      lastName: z
        .string()
        .min(1, 'Last name is required.')
        .max(20, 'Last name must be at most 20 characters.')
        .refine((val) => val.trim().length > 0, {
          message: 'Last name cannot be just white spaces.',
        }),
      email: z.string().email('Invalid email.'),
      password: z.string().min(6, 'Password must be at least 6 characters.'),
      confirmPassword: z
        .string()
        .min(6, 'Confirm Password must be at least 6 characters.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    });

  private loginSchema = z.object({
    email: z.string().email('Invalid email.'),
    password: z.string(),
  });
  prototype: any;

  validateCreateUser(data: any) {
    return this.createUserSchema.parse(data);
  }

  validateLogin(data: any) {
    return this.loginSchema.parse(data);
  }
}

export default new UserValidator();
