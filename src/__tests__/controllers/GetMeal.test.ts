import { GetMealController } from '../../controllers/meal/GetMeal';
import { GetMealService } from '../../services/meal/GetMealService';
import { Request, Response } from 'express';

jest.mock('../../services/meal/GetMealService');

describe('GetMealController', () => {
  let getMealController: GetMealController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    getMealController = new GetMealController();

    mockRequest = {
      userId: 1,
      params: { id: '1' },
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockNextFunction = jest.fn();
  });

  it('should return 401 if user is not authorized', async () => {
    mockRequest.userId = undefined;

    await getMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 404 if meal is not found', async () => {
    jest.mocked(GetMealService.prototype.execute).mockResolvedValue(null);

    await getMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Meal not found',
    });
  });

  it('should return the meal object if found', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'password123',
      meals: [],
      validatePassword: jest.fn(),
    };

    const mockMeal = {
      id: 1,
      name: 'Healthy Salad',
      description: 'A mix of fresh vegetables',
      dateTime: new Date(),
      isDiet: true,
      user: mockUser,
    };

    jest.mocked(GetMealService.prototype.execute).mockResolvedValue(mockMeal);

    await getMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockMeal);
  });

  it('should return 500 if there is a server error', async () => {
    const errorMessage = 'Server error';
    jest
      .mocked(GetMealService.prototype.execute)
      .mockRejectedValue(new Error(errorMessage));

    await getMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
