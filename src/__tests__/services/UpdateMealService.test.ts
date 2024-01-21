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
    updateMeal: jest.fn(),
  })),
}));

describe('UpdateMealService', () => {
  let updateMealService: UpdateMealService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockMealRepository: jest.Mocked<MealRepository>;

  const mockUser = new User();
  mockUser.id = 30;
  mockUser.firstName = 'João';
  mockUser.lastName = 'Silva';
  mockUser.email = 'joao@example.com';
  mockUser.password = 'hashed_password';
  mockUser.validatePassword = jest.fn().mockResolvedValue(true);
  mockUser.meals = [];

  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  it('should update a meal successfully when the user is the creator', async () => {
    const userId = 30;
    const mealId = 100;
    const updatedMealData = {
      id: mealId,
      name: 'Updated Lunch',
      description: 'Even more delicious',
      dateTime: '2024-01-17T14:00:00.000Z',
      isDiet: false,
    };

    const updatedMeal = new Meal();
    updatedMeal.id = mealId;
    updatedMeal.name = 'Updated Lunch';
    updatedMeal.description = 'Even more delicious';
    updatedMeal.dateTime = new Date('2024-01-17T14:00:00.000Z');
    updatedMeal.isDiet = false;
    updatedMeal.user = mockUser;

    mockMealRepository.updateMeal.mockResolvedValue(updatedMeal);

    const result = await updateMealService.execute(updatedMealData, userId);

    expect(result).toEqual(updatedMeal);
    expect(mockMealRepository.updateMeal).toHaveBeenCalledWith(
      mealId,
      expect.objectContaining({
        name: 'Updated Lunch',
        description: 'Even more delicious',
        dateTime: expect.any(Date),
        isDiet: false,
      }),
    );
  });

  it('should not update a meal if the user is not the creator', async () => {
    const nonCreatorUserId = 31;
    const mealId = 100;
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(
      updateMealService.execute(
        {
          id: mealId,
          name: 'Attempted Update Lunch',
          description: 'Attempted Update Description',
          dateTime: '2024-01-18T14:00:00.000Z',
          isDiet: false,
        },
        nonCreatorUserId,
      ),
    ).rejects.toThrow('User not found.');
  });

  it('should throw an error when the static execute method is called', () => {
    const updatedMealData = {
      id: 1,
      name: 'Test Meal',
      description: 'Test Description',
      dateTime: '2024-01-17T14:00:033Z',
      isDiet: false,
    };
    const userId = 1;

    expect(() => {
      UpdateMealService.execute(updatedMealData, userId);
    }).toThrow('Method not implemented.');
  });

  it('should throw an error for not implemented method', () => {
    expect(() => {
      updateMealService.notImplementedMethod();
    }).toThrow('Method not implemented.');
  });
});
