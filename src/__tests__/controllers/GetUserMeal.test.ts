import { Request, Response } from 'express';
import { GetUserMealsController } from '../../controllers/meal/GetUserMeal';
import { GetUserMealsService } from '../../services/meal/GetUserMealsService';
import { Meal } from '../../entities/Meal';
import { User } from '../../entities/User';

jest.mock('../../services/meal/GetUserMealsService');

describe('GetUserMealsController', () => {
  let getUserMealsController: GetUserMealsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let getUserMealsServiceMock: jest.Mocked<GetUserMealsService>;

  beforeEach(() => {
    getUserMealsServiceMock =
      new GetUserMealsService() as jest.Mocked<GetUserMealsService>;
    getUserMealsController = new GetUserMealsController(
      getUserMealsServiceMock,
    );

    mockRequest = {
      userId: 1,
    } as Partial<Request>;

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>;
  });

  it('should return meals for authorized user', async () => {
    const mockUser: User = {
      id: 1,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'mockPassword',
      validatePassword: jest.fn(),
      meals: [],
    };

    const mockMeals: Meal[] = [
      {
        id: 1,
        name: 'Meal 1',
        description: 'Description for Meal 1',
        dateTime: new Date(),
        isDiet: true,
        user: mockUser,
      },
      {
        id: 2,
        name: 'Meal 2',
        description: 'Description for Meal 2',
        dateTime: new Date(),
        isDiet: false,
        user: mockUser,
      },
    ];

    getUserMealsServiceMock.execute.mockResolvedValue(mockMeals);

    await getUserMealsController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(getUserMealsServiceMock.execute).toHaveBeenCalledWith(
      mockRequest.userId,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockMeals);
  });
  it('should return 401 if no userId is provided', async () => {
    mockRequest = {} as Partial<Request>;

    await getUserMealsController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  it('should return 500 if the service throws an error', async () => {
    mockRequest = { userId: 1 } as Partial<Request>;
    const errorMessage = 'Test error';

    getUserMealsServiceMock.execute.mockRejectedValue(new Error(errorMessage));

    await getUserMealsController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
