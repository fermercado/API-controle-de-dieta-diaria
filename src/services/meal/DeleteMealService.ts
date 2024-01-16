import { MealRepository } from '../../repositories/MealRepository';
import { AppDataSource } from '../../ormconfig';

export class DeleteMealService {
  private mealRepository: MealRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
  }

  async execute(mealId: number, userId: number): Promise<boolean> {
    return this.mealRepository.deleteMeal(mealId, userId);
  }
}
