import { Meal } from '../../entities/Meal';
import { AppDataSource } from '../../ormconfig';
import { MealRepository } from '../../repositories/MealRepository';

export class GetMealService {
  private mealRepository: MealRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
  }

  async execute(mealId: number, userId: number): Promise<Meal | null> {
    return await this.mealRepository.findOneBy({
      id: mealId,
      user: { id: userId },
    });
  }
}
