import { Request, Response } from 'express';
import { GetMealService } from '../../services/meal/GetMealService';

export class GetMealController {
  private getMealService: GetMealService;

  constructor() {
    this.getMealService = new GetMealService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.userId;
    const mealId = parseInt(request.params.id);

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const meal = await this.getMealService.execute(mealId, userId);
      if (!meal) {
        return response.status(404).json({ message: 'Meal not found' });
      }
      return response.json(meal);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
}
