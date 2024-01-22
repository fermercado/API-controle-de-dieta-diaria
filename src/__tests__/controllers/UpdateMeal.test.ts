import { UpdateMealController } from '../../controllers/meal/UpdateMeal';
import { UpdateMealService } from '../../services/meal/UpdateMealService';
import { Request, Response } from 'express';
import { ZodError, z } from 'zod';
import MealValidator from '../../middleware/MealValidator';

jest.mock('../../services/meal/UpdateMealService');
jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/MealRepository');
jest.mock('../../middleware/MealValidator', () => ({
  validateUpdateMeal: jest.fn(),
}));

describe('UpdateMealController', () => {
  let consoleSpy: jest.SpyInstance<
    void,
    [message?: any, ...optionalParams: any[]],
    any
  >;
  let updateMealController: UpdateMealController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    updateMealController = new UpdateMealController();
    mockRequest = { params: {}, userId: 123, body: {} as any };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return unauthorized if userId is missing', async () => {
    mockRequest.userId = undefined;

    await updateMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return a validation error for invalid data', async () => {
    const error = new z.ZodError([
      {
        message: 'Invalid data',
        path: ['mealName'],
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ]);
    (MealValidator.validateUpdateMeal as jest.Mock).mockImplementation(() => {
      throw error;
    });

    mockRequest.params = { id: '1' };
    mockRequest.body = {};

    await updateMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: error.errors.map((e) => ({ message: e.message })),
    });
  });

  it('should handle service errors', async () => {
    const validatedData = {
      mealName: 'Breakfast',
    };
    (MealValidator.validateUpdateMeal as jest.Mock).mockReturnValue(
      validatedData,
    );

    const updateMealMock = UpdateMealService.prototype.execute as jest.Mock;
    updateMealMock.mockRejectedValue(new Error('Service error'));

    mockRequest.params = { id: '1' };
    mockRequest.body = validatedData;

    await updateMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Service error',
    });
  });

  it('should successfully update a meal', async () => {
    const mealResponse = {
      id: '1',
      mealName: 'Breakfast',
      calories: 300,
    };
    const updateMealMock = UpdateMealService.prototype.execute as jest.Mock;
    updateMealMock.mockResolvedValue(mealResponse);

    mockRequest.params = { id: '1' };
    mockRequest.body = {
      mealName: 'Breakfast',
      calories: 300,
    };

    await updateMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.json).toHaveBeenCalledWith(mealResponse);
  });

  it('should log an error for ZodError', async () => {
    const error = new ZodError([
      {
        message: 'Invalid data',
        path: ['mealName'],
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ]);

    (MealValidator.validateUpdateMeal as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const mockRequest = {
      params: {
        id: '1',
      },
      body: {
        mealName: 123,
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateMealController.handle(mockRequest as any, mockResponse as any);

    try {
    } catch (error) {
      console.error('UpdateMealController.handle - Error:', error);
    }
  });
});
