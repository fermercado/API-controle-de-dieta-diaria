import { Request, Response } from 'express';
import { CreateMealService } from '../../services/meal/CreateMealService';
import MealValidator from '../../middleware/MealValidator';
import { z } from 'zod';

export class CreateMealController {
  private createMealService: CreateMealService;

  constructor() {
    this.createMealService = new CreateMealService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    if (request.userId === undefined) {
      return response
        .status(401)
        .json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
      const validatedData = MealValidator.validateCreateMeal(request.body);

      const meal = await this.createMealService.execute(
        validatedData,
        request.userId,
      );

      return response.json(meal);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ errors: error.errors });
      }
      return response.status(500).json({ error: error.message });
    }
  }
}
