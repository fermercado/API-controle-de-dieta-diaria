import MealValidator from '../../middleware/MealValidator';

describe('MealValidator', () => {
  describe('validateCreateMeal', () => {
    it('should validate a correct meal creation object', () => {
      const validMeal = {
        name: 'Healthy Salad',
        description: 'A mix of fresh vegetables',
        dateTime: '2024-01-20T12:00:54.033Z',
        isDiet: true,
      };
      expect(() => MealValidator.validateCreateMeal(validMeal)).not.toThrow();
    });
    it('should validate a correct meal update object', () => {
      const validUpdateMeal = {
        name: 'Updated Salad',
        description: 'Updated mix of vegetables',
        dateTime: '2024-01-21T12:00:54.033Z',
        isDiet: true,
      };
      expect(() =>
        MealValidator.validateUpdateMeal(validUpdateMeal),
      ).not.toThrow();
    });
  });
  it('should reject invalid dateTime format in meal update', () => {
    const invalidUpdateMeal = {
      name: 'Updated Salad',
      description: 'Updated mix of vegetables',
      dateTime: 'another-invalid-date',
    };
    expect(() => MealValidator.validateUpdateMeal(invalidUpdateMeal)).toThrow();
  });
  it('should reject invalid dateTime format in meal creation', () => {
    const invalidMeal = {
      name: 'Healthy Salad',
      description: 'A mix of fresh vegetables',
      dateTime: 'invalid-date-time',
      isDiet: true,
    };
    expect(() => MealValidator.validateCreateMeal(invalidMeal)).toThrow();
  });
});
