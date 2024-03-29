import { Request, Response } from 'express';
import { UpdateMealService } from '../../services/meal/UpdateMealService';
import MealValidator from '../../middleware/MealValidator';
import { z } from 'zod';
import { UserRepository } from '../../repositories/UserRepository';
import { MealRepository } from '../../repositories/MealRepository';
import AppDataSource from '../../ormconfig';

export class UpdateMealController {
  private updateMealService: UpdateMealService;

  constructor() {
    const userRepository = new UserRepository(AppDataSource);
    const mealRepository = new MealRepository(AppDataSource);

    this.updateMealService = new UpdateMealService(
      userRepository,
      mealRepository,
    );
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
        const errorMessages = error.errors.map((e) => ({ message: e.message }));
        return response.status(400).json({ errors: errorMessages });
      }
      return response.status(500).json({ error: error.message });
    }
  }
}
