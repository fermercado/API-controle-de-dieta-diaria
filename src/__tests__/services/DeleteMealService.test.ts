import { DeleteMealService } from '../../services/meal/DeleteMealService';
import * as MealRepositoryModule from '../../repositories/MealRepository';
import { Meal } from '../../entities/Meal';

jest.mock('../../repositories/MealRepository');

describe('DeleteMealService', () => {
  let deleteMealService: DeleteMealService;
  let mealRepositoryMock: jest.Mocked<MealRepositoryModule.MealRepository>;

  beforeEach(() => {
    deleteMealService = new DeleteMealService();
    mealRepositoryMock = MealRepositoryModule.MealRepository
      .prototype as jest.Mocked<MealRepositoryModule.MealRepository>;
  });

  it('should delete a meal successfully', async () => {
    const userId = 20;
    const mealId = 32;

    const mockMeal: Meal = {
      id: mealId,
      name: 'Meal Name',
      description: 'Meal Description',
      dateTime: new Date(),
      isDiet: false,
      user: {
        id: userId,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        meals: [],
        validatePassword: function (
          unencryptedPassword: string,
        ): Promise<boolean> {
          throw new Error('Function not implemented.');
        },
      },
    };

    mealRepositoryMock.findOneBy.mockResolvedValue(mockMeal);
    mealRepositoryMock.deleteMeal.mockResolvedValue(true);

    const result = await deleteMealService.execute(mealId, userId);

    expect(result).toBeTruthy();
    expect(result).toEqual(mockMeal);
  });

  it('should throw an error if meal is not found', async () => {
    const userId = 20;
    const mealId = 32;

    mealRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(deleteMealService.execute(mealId, userId)).rejects.toThrow(
      'Meal not found or not authorized to delete this meal.',
    );
  });
});
