import { Request, Response } from 'express';
import { CreateMealController } from '../../controllers/meal/CreateMeal';
import { CreateMealService } from '../../services/meal/CreateMealService';
import MealValidator from '../../middleware/MealValidator';
import { ZodError } from 'zod';

jest.mock('../../services/meal/CreateMealService');
jest.mock('../../middleware/MealValidator');

describe('CreateMealController', () => {
  let createMealController: CreateMealController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    createMealController = new CreateMealController();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      status: mockStatus,
      json: mockSend,
    };
    mockReq = {
      body: {
        name: 'Meal Name',
        description: 'Meal Description',
        dateTime: '2022-01-01T12:00:00Z',
        isDiet: true,
      },
      userId: 1,
    };
  });

  it('should successfully create a meal', async () => {
    jest
      .spyOn(MealValidator, 'validateCreateMeal')
      .mockReturnValue(mockReq.body);
    (CreateMealService.prototype.execute as jest.Mock).mockResolvedValue({
      id: 1,
      ...mockReq.body,
      dateTime: new Date(mockReq.body.dateTime),
      user: { id: mockReq.userId },
    });

    await createMealController.handle(mockReq as Request, mockRes as Response);

    expect(mockSend).toHaveBeenCalledWith({
      id: 1,
      ...mockReq.body,
      dateTime: new Date(mockReq.body.dateTime),
      user: { id: mockReq.userId },
    });
  });

  it('should handle meal validation errors', async () => {
    const zodError = new ZodError([]);
    jest.spyOn(MealValidator, 'validateCreateMeal').mockImplementation(() => {
      throw zodError;
    });

    await createMealController.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({ errors: zodError.errors });
  });

  it('should handle unexpected server errors', async () => {
    jest
      .spyOn(MealValidator, 'validateCreateMeal')
      .mockReturnValue(mockReq.body);
    (CreateMealService.prototype.execute as jest.Mock).mockImplementation(
      () => {
        throw new Error('Unexpected error');
      },
    );

    await createMealController.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({ error: 'Unexpected error' });
  });
  it('should return 401 if userId is missing', async () => {
    mockReq.userId = undefined;

    await createMealController.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockSend).toHaveBeenCalledWith({
      message: 'Unauthorized: User ID is missing.',
    });
  });
});
