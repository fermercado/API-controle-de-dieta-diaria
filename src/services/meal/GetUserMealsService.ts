import { AppDataSource } from '../../ormconfig';
import { MealRepository } from '../../repositories/MealRepository';
import { Meal } from '../../entities/Meal';

export class GetUserMealsService {
  private mealRepository: MealRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
  }

  async execute(userId: number): Promise<Meal[]> {
    return this.mealRepository.findMealsByUser(userId);
  }
}
