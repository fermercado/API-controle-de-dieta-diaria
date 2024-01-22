import { z } from 'zod';

class MealValidator {
  private timeWithMillisecondsRegex =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})/;

  private createMealSchema = z.object({
    name: z
      .string()
      .max(50, 'Name must be at most 50 characters.')
      .refine((val) => val.trim().length > 0, {
        message: 'Name cannot be just white spaces.',
      }),
    description: z
      .string()
      .max(50, 'Description must be at most 50 characters.')
      .refine((val) => val.trim().length > 0, {
        message: 'Description cannot be just white spaces.',
      }),
    dateTime: z.string().refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        return false;
      }
      const dateString = date.toISOString().split('T')[0];
      const isValidDate = dateString === val.split('T')[0];
      const includesMilliseconds = this.timeWithMillisecondsRegex.test(val);
      return isValidDate && includesMilliseconds;
    }, 'Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS.sss'),
    isDiet: z.boolean({
      required_error: 'isDiet is required',
      invalid_type_error: 'isDiet must be a boolean',
    }),
  });
  prototype: any;

  validateCreateMeal(data: any) {
    return this.createMealSchema.parse(data);
  }
  private updateMealSchema = z.object({
    name: z
      .string()
      .max(50, 'Description must be at most 50 characters')
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Name cannot be just white spaces.',
      }),
    description: z
      .string()
      .max(50, 'Description must be at most 50 characters')
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Description cannot be just white spaces.',
      }),
    dateTime: z
      .string()
      .refine((val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          return false;
        }
        const dateString = date.toISOString().split('T')[0];
        const isValidDate = dateString === val.split('T')[0];
        const includesMilliseconds = this.timeWithMillisecondsRegex.test(val);
        return isValidDate && includesMilliseconds;
      }, 'Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS.sss')
      .optional(),
    isDiet: z
      .boolean({
        required_error: 'isDiet is required',
        invalid_type_error: 'isDiet must be a boolean',
      })
      .optional(),
  });
  validateUpdateMeal(data: any) {
    return this.updateMealSchema.parse(data);
  }
}

export default new MealValidator();
