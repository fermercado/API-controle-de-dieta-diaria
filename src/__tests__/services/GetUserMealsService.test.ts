import { GetUserMealsService } from '../../services/meal/GetUserMealsService';
import { User } from '../../entities/User';
import { AppDataSource } from '../../ormconfig';

jest.mock('../../ormconfig', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('GetUserMealsService', () => {
  let getUserMealsService: GetUserMealsService;
  let mockMealRepository: {
    find: jest.Mock;
  };

  beforeEach(() => {
    mockMealRepository = {
      find: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Breakfast',
          description: 'Toast and eggs',
          dateTime: new Date('2024-01-20T12:22:36.449Z'),
          isDiet: false,
          user: {
            id: 1,
            firstName: 'João',
            lastName: 'Silva',
            email: 'joao@example.com',
            password: 'mockPassword',
            meals: [],
            validatePassword: jest.fn(),
          } as User,
        },
      ]),
    };

    jest
      .mocked(AppDataSource.getRepository)
      .mockReturnValue(mockMealRepository as any);

    getUserMealsService = new GetUserMealsService();
  });

  it('should return a list of meals for a given user', async () => {
    const userId = 1;

    const result = await getUserMealsService.execute(userId);

    expect(result).toEqual([
      {
        id: 1,
        name: 'Breakfast',
        description: 'Toast and eggs',
        dateTime: new Date('2024-01-20T12:22:36.449Z'),
        isDiet: false,
        user: {
          id: 1,
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          password: 'mockPassword',
          meals: [],
          validatePassword: expect.any(Function),
        },
      },
    ]);
    expect(mockMealRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
    });
  });
  it('should return a message if no meals are found for a given user', async () => {
    mockMealRepository.find.mockResolvedValue([]);

    const userId = 1;

    const result = await getUserMealsService.execute(userId);

    expect(result).toEqual({ message: 'No meals found for this user.' });

    expect(mockMealRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
    });
  });
});
