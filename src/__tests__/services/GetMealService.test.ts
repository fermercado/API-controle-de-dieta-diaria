import { GetMealService } from '../../services/meal/GetMealService';
import { Meal } from '../../entities/Meal';
import { User } from '../../entities/User';
import { MealRepository } from '../../repositories/MealRepository';

jest.mock('../../repositories/MealRepository');

describe('GetMealService', () => {
  let getMealService: GetMealService;
  let mockFindOneBy: jest.Mock;

  beforeEach(() => {
    mockFindOneBy = jest.fn();
    MealRepository.prototype.findOneBy = mockFindOneBy;

    getMealService = new GetMealService();
  });

  it('should return a meal when found', async () => {
    const mockUser: User = {
      id: 1,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'password123',
      validatePassword: jest.fn(),
      meals: [],
    };

    const mockMeal: Meal = {
      id: 1,
      name: 'Test Meal',
      description: 'A delicious test meal',
      dateTime: new Date(),
      isDiet: true,
      user: mockUser,
    };

    mockFindOneBy.mockResolvedValueOnce(mockMeal);

    const result = await getMealService.execute(1, 1);

    expect(result).toEqual(mockMeal);
  });

  it('should return null if no meal is found', async () => {
    mockFindOneBy.mockResolvedValueOnce(null);

    const result = await getMealService.execute(1, 1);

    expect(result).toBeNull();
  });
});
