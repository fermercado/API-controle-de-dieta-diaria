import { Request, Response } from 'express';
import { CreateMealService } from '../../services/meal/CreateMealService';

export class CreateMealController {
  private createMealService: CreateMealService;

  constructor() {
    this.createMealService = new CreateMealService();
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, dateTime, isDiet } = request.body;
    const userId = request.userId;

    if (userId === undefined) {
      return response
        .status(401)
        .json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
      const meal = await this.createMealService.execute(
        {
          name,
          description,
          dateTime,
          isDiet,
        },
        userId,
      );

      return response.json(meal);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
}
