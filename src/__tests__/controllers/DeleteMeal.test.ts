import { Request, Response } from 'express';
import { DeleteMealController } from '../../controllers/meal/DeleteMeal';
import { DeleteMealService } from '../../services/meal/DeleteMealService';

jest.mock('../../services/meal/DeleteMealService');

describe('DeleteMealController', () => {
  let deleteMealController: DeleteMealController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockExecute: jest.SpyInstance;

  beforeEach(() => {
    deleteMealController = new DeleteMealController();
    mockRequest = {
      params: { id: '1' },
      userId: 123,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockExecute = jest.spyOn(DeleteMealService.prototype, 'execute');
  });

  afterEach(() => {
    mockExecute.mockRestore();
  });

  it('should delete a meal and return success message', async () => {
    const deletedMeal = {};
    mockExecute.mockResolvedValueOnce(deletedMeal);

    await deleteMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Meal successfully deleted',
      meal: deletedMeal,
    });
  });

  it('should handle error and return 500 status', async () => {
    const errorMessage = 'An error occurred.';
    mockExecute.mockRejectedValueOnce(new Error(errorMessage));

    await deleteMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  it('should return 401 status if userId is not provided', async () => {
    mockRequest.userId = undefined;

    await deleteMealController.handle(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});
