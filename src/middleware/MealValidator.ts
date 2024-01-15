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

  validateCreateMeal(data: any) {
    return this.createMealSchema.parse(data);
  }
}

export default new MealValidator();
