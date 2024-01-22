import { UpdateMealService } from '../../services/meal/UpdateMealService';
import { MealRepository } from '../../repositories/MealRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { DataSource } from 'typeorm';
import { User } from '../../entities/User';
import { Meal } from '../../entities/Meal';

jest.mock('../../repositories/UserRepository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findOneBy: jest.fn(),
  })),
}));

jest.mock('../../repositories/MealRepository', () => ({
  MealRepository: jest.fn().mockImplementation(() => ({
    findOneBy: jest.fn(),
    updateMeal: jest.fn(),
  })),
}));

describe('UpdateMealService', () => {
  let updateMealService: UpdateMealService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockMealRepository: jest.Mocked<MealRepository>;

  const userId = 1;
  const mealId = 1;
  let mockUser: User;
  let mockMeal: Meal;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = new User();
    mockUser.id = userId;

    mockMeal = new Meal();
    mockMeal.id = mealId;
    mockMeal.user = mockUser;

    mockUserRepository = new UserRepository(
      {} as DataSource,
    ) as jest.Mocked<UserRepository>;
    mockMealRepository = new MealRepository(
      {} as DataSource,
    ) as jest.Mocked<MealRepository>;

    updateMealService = new UpdateMealService(
      mockUserRepository,
      mockMealRepository,
    );

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);
    mockMealRepository.findOneBy.mockResolvedValue(mockMeal);
  });

  it('should update a meal successfully when the user is the creator', async () => {
    const updatedMealData = {
      name: 'Updated Lunch',
      description: 'Even more delicious',
      dateTime: '2024-01-17T14:00:00.000Z',
      isDiet: false,
    };

    const updatedMeal = new Meal();

    updatedMeal.dateTime = new Date(updatedMealData.dateTime);

    mockMealRepository.updateMeal.mockResolvedValue(updatedMeal);

    const result = await updateMealService.execute(
      { id: mealId, ...updatedMealData },
      userId,
    );

    expect(result).toEqual(updatedMeal);
    expect(mockMealRepository.updateMeal).toHaveBeenCalledWith(
      mealId,
      expect.objectContaining({
        ...updatedMealData,
        dateTime: expect.any(Date),
      }),
    );
  });

  it('should not update a meal if the user is not the creator', async () => {
    const nonCreatorUserId = 2;

    const updatedMealData = {
      id: mealId,
      name: 'Attempted Update Lunch',
      description: 'Attempted Update Description',
      dateTime: '2024-01-18T14:00:00.000Z',
      isDiet: false,
    };

    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(
      updateMealService.execute(updatedMealData, nonCreatorUserId),
    ).rejects.toThrow('Unauthorized to update this meal.');
  });
  it('should throw an error if the meal is not found', async () => {
    const mealId = 1;
    const userId = 1;
    const updatedMealData = {
      name: 'Updated Lunch',
      description: 'Even more delicious',
      dateTime: '2024-01-17T14:00:00.000Z',
      isDiet: false,
    };

    mockMealRepository.findOneBy.mockResolvedValue(null);

    await expect(
      updateMealService.execute({ id: mealId, ...updatedMealData }, userId),
    ).rejects.toThrow('Meal not found.');

    expect(mockMealRepository.findOneBy).toHaveBeenCalledWith(mealId, userId);
  });
});
