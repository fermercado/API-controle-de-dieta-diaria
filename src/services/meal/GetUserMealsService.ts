import { MealRepository } from '../../repositories/MealRepository';
import { AppDataSource } from '../../ormconfig';

export class GetUserMealsService {
  private mealRepository: MealRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
  }

  async execute(userId: number): Promise<any> {
    const meals = await this.mealRepository.GetUserMeal(userId);

    if (meals.length === 0) {
      return { message: 'No meals found for this user.' };
    }

    return meals;
  }
}
