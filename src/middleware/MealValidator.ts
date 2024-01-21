import { z } from 'zod';

class MealValidator {
  private createMealSchema = z.object({
    name: z
      .string()
      .max(50, 'Name must be at most 50 characters.')
      .refine((val) => val.trim().length > 0, {
        message: 'Name cannot be just white spaces.',
      }),
    description: z
      .string()
      .max(100, 'Description must be at most 100 characters.')
      .refine((val) => val.trim().length > 0, {
        message: 'Description cannot be just white spaces.',
      }),
    dateTime: z.string().refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        return false;
      }
      const dateString = date.toISOString().split('T')[0];
      return dateString === val.split('T')[0];
    }, 'Invalid date format.'),
    isDiet: z.boolean(),
  });
  prototype: any;

  validateCreateMeal(data: any) {
    return this.createMealSchema.parse(data);
  }
  private updateMealSchema = z.object({
    name: z
      .string()
      .max(50)
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Name cannot be just white spaces.',
      }),
    description: z
      .string()
      .max(100)
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Description cannot be just white spaces.',
      }),
    dateTime: z
      .string()
      .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
        message: 'Invalid date format.',
      })
      .optional(),
    isDiet: z.boolean().optional(),
  });
  validateUpdateMeal(data: any) {
    return this.updateMealSchema.parse(data);
  }
}

export default new MealValidator();
