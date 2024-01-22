import { MealRepository } from '../../repositories/MealRepository';
import { AppDataSource } from '../../ormconfig';
import { Meal } from '../../entities/Meal';

export class DeleteMealService {
  private mealRepository: MealRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
  }

  async execute(mealId: number, userId: number): Promise<Meal | null> {
    const meal = await this.mealRepository.findOneBy(mealId, userId);

    if (!meal) {
      throw new Error('Meal not found or not authorized to delete this meal.');
    }

    await this.mealRepository.deleteMeal(mealId, userId);

    return meal;
  }
}
