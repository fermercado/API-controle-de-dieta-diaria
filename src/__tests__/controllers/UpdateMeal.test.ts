import { UpdateMealController } from '../../controllers/meal/UpdateMeal';
import { UpdateMealService } from '../../services/meal/UpdateMealService';
import MealValidator from '../../middleware/MealValidator';
import { Request, Response } from 'express';
import { z } from 'zod';

jest.mock('../../services/meal/UpdateMealService');
jest.mock('../../middleware/MealValidator');

describe('UpdateMealController', () => {
  let updateMealController: UpdateMealController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    updateMealController = new UpdateMealController();

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it('should return a successful response for valid data', async () => {
    const mockRequest = {
      params: { id: '1' },
      body: {
        name: 'Updated Meal',
        description: 'Updated description',
        dateTime: '2024-01-20T12:00:00',
        isDiet: false,
      },
      userId: 123,
    } as Partial<Request>;

    const mockUpdatedMeal = {
      id: 1,
      ...mockRequest.body,
      dateTime: new Date('2024-01-20T12:00:00'),
      user: { id: 123 },
    };

    MealValidator.validateUpdateMeal = jest
      .fn()
      .mockReturnValue(mockRequest.body);

    (UpdateMealService.prototype.execute as jest.Mock).mockResolvedValue(
      mockUpdatedMeal,
    );

    await updateMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedMeal);
  });

  it('should return a 401 error when user is not authenticated', async () => {
    const mockRequest = {
      params: { id: '1' },
      body: {},
      userId: undefined,
    } as Partial<Request>;

    await updateMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return a 400 error for validation failure', async () => {
    const mockRequest = {
      params: { id: '1' },
      body: {
        name: '',
        description: '',
        dateTime: '',
        isDiet: 'string',
      },
      userId: 123,
    } as Partial<Request>;

    const validationError = new z.ZodError([]);
    MealValidator.validateUpdateMeal = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await updateMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: validationError.errors,
    });
  });
  it('should return a 500 error for unexpected exceptions', async () => {
    const mockRequest = {
      params: { id: '1' },
      body: {
        name: 'Valid Meal Name',
        description: 'Valid description',
        dateTime: '2024-01-20T12:00:00',
        isDiet: true,
      },
      userId: 123,
    } as Partial<Request>;

    const unexpectedError = new Error('Unexpected error');
    (UpdateMealService.prototype.execute as jest.Mock).mockRejectedValue(
      unexpectedError,
    );

    MealValidator.validateUpdateMeal = jest
      .fn()
      .mockReturnValue(mockRequest.body);

    await updateMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: unexpectedError.message,
    });
  });
});
