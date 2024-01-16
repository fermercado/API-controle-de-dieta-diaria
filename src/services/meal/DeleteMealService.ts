import { AppDataSource } from '../../ormconfig';
import { Meal } from '../../entities/Meal';

export class DeleteMealService {
  async execute(mealId: number, userId: number): Promise<Meal> {
    const mealRepository = AppDataSource.getRepository(Meal);
    const meal = await mealRepository.findOneBy({
      id: mealId,
      user: { id: userId },
    });

    if (!meal) {
      throw new Error('Meal not found or not owned by user.');
    }

    await mealRepository.remove(meal);
    return meal;
  }
}
