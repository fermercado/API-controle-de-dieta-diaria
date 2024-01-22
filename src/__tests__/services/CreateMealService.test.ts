import { CreateMealService } from '../../services/meal/CreateMealService';
import * as MealRepositoryModule from '../../repositories/MealRepository';
import * as UserRepositoryModule from '../../repositories/UserRepository';

jest.mock('../../repositories/MealRepository');
jest.mock('../../repositories/UserRepository');

describe('CreateMealService', () => {
  let createMealService: CreateMealService;

  beforeEach(() => {
    createMealService = new CreateMealService();
  });

  it('should create a meal successfully', async () => {
    const mealInput = {
      name: 'string',
      description: 'string',
      dateTime: '2024-01-19T03:29:54.033Z',
      isDiet: true,
    };
    const userId = 20;

    const mockUser = {
      id: userId,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'securepassword',
      meals: [],
      validatePassword: jest.fn(),
    };

    const userRepositoryMock =
      UserRepositoryModule.UserRepository as jest.MockedClass<
        typeof UserRepositoryModule.UserRepository
      >;
    const mealRepositoryMock =
      MealRepositoryModule.MealRepository as jest.MockedClass<
        typeof MealRepositoryModule.MealRepository
      >;

    userRepositoryMock.prototype.findOneBy.mockResolvedValue(mockUser);
    mealRepositoryMock.prototype.createMeal.mockResolvedValue({
      ...mealInput,
      dateTime: new Date(mealInput.dateTime),
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
      id: 32,
    });

    const result = await createMealService.execute(mealInput, userId);

    expect(result).toMatchObject({
      ...mealInput,
      dateTime: new Date(mealInput.dateTime),
      user: { id: userId },
      id: 32,
    });
  });

  it('should throw an error if user is not found', async () => {
    const mealInput = {
      name: 'string',
      description: 'string',
      dateTime: '2024-01-19T03:29:54.033Z',
      isDiet: true,
    };
    const userId = 20;

    const userRepositoryMock =
      UserRepositoryModule.UserRepository as jest.MockedClass<
        typeof UserRepositoryModule.UserRepository
      >;
    userRepositoryMock.prototype.findOneBy.mockResolvedValue(null);

    await expect(createMealService.execute(mealInput, userId)).rejects.toThrow(
      'User not found.',
    );
  });

  it('should throw an error when execute is called', () => {
    expect(() => {
      CreateMealService.execute(
        {
          name: 'string',
          description: 'string',
          dateTime: '2024-01-19T03:29:54.033Z',
          isDiet: true,
        },
        20,
      );
    }).toThrow('Method not implemented.');
  });
});
