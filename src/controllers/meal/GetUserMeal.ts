import { Request, Response } from 'express';
import { GetUserMealsService } from '../../services/meal/GetUserMealsService';

export class GetUserMealsController {
  private getUserMealsService: GetUserMealsService;

  constructor() {
    this.getUserMealsService = new GetUserMealsService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const meals = await this.getUserMealsService.execute(userId);
      return response.json(meals);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
}
