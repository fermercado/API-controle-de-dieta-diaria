import { Request, Response } from 'express';
import { DeleteMealService } from '../../services/meal/DeleteMealService';

export class DeleteMealController {
  private deleteMealService: DeleteMealService;

  constructor() {
    this.deleteMealService = new DeleteMealService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const meal = await this.deleteMealService.execute(Number(id), userId);
      return response
        .status(200)
        .json({ message: 'Meal successfully deleted', meal: meal });
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
}
