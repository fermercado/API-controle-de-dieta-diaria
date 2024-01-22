import { CreateMealController } from '../../controllers/meal/CreateMeal';
import { CreateMealService } from '../../services/meal/CreateMealService';
import { Request, Response } from 'express';
import { z } from 'zod';

jest.mock('../../services/meal/CreateMealService');

describe('CreateMealController', () => {
  let createMealController: CreateMealController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    createMealController = new CreateMealController();
    mockRequest = { body: {}, userId: 123 };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return 401 status if user ID is missing', async () => {
    mockRequest.userId = undefined;

    await createMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unauthorized: User ID is missing.',
    });
  });

  it('should return 400 status and error messages for invalid data', async () => {
    const error = new z.ZodError([
      {
        message: 'Invalid data',
        path: ['mealName'],
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ]);
    (CreateMealService.prototype.execute as jest.Mock).mockRejectedValue(error);

    mockRequest.body = {
      mealName: 123,
    };

    try {
      await createMealController.handle(
        mockRequest as any,
        mockResponse as any,
      );
    } catch (error) {
      const err = error as z.ZodError;
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: err.errors.map((e) => ({ message: e.message })),
      });
    }
  });

  it('should return 500 status and error message for service error', async () => {
    const errorMessage = 'Service error';
    (CreateMealService.prototype.execute as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    mockRequest.body = {
      mealName: 'Breakfast',
    };

    try {
      await createMealController.handle(
        mockRequest as any,
        mockResponse as any,
      );
    } catch (error) {
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    }
  });

  it('should return the created meal for valid data', async () => {
    const meal = {
      id: 'meal123',
      name: 'Breakfast',
      description: 'Delicious breakfast',
      dateTime: new Date().toISOString(),
      isDiet: false,
      user: {
        id: 'user123',
      },
    };

    (CreateMealService.prototype.execute as jest.Mock).mockResolvedValue(meal);

    mockRequest.body = {
      name: 'Breakfast',
      description: 'Delicious breakfast',
      dateTime: new Date().toISOString(),
      isDiet: false,
    };

    await createMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.json).toHaveBeenCalledWith(meal);
  });
  it('should return a 500 error for unexpected errors', async () => {
    (CreateMealService.prototype.execute as jest.Mock).mockImplementation(
      () => {
        throw new Error('Unexpected error');
      },
    );

    mockRequest.body = {
      name: 'Breakfast',
      description: 'Delicious breakfast',
      dateTime: new Date().toISOString(),
      isDiet: false,
    };
    mockRequest.userId = 123;

    await createMealController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unexpected error',
    });
  });
});
