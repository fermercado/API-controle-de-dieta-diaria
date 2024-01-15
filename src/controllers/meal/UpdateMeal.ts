import { Request, Response } from 'express';
import { UpdateMealService } from '../../services/meal/UpdateMealService';
import MealValidator from '../../middleware/MealValidator';
import { z } from 'zod';

export class UpdateMealController {
  private updateMealService: UpdateMealService;

  constructor() {
    this.updateMealService = new UpdateMealService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const validatedData = MealValidator.validateUpdateMeal(request.body);

      const meal = await this.updateMealService.execute(
        { ...validatedData, id: Number(id) },
        userId,
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
