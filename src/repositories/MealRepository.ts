import { Repository } from 'typeorm';
import { Meal } from '../entities/Meal';

export class MealRepository {
  private repository: Repository<Meal>;

  constructor(repository: Repository<Meal>) {
    this.repository = repository;
  }

  async createMeal(mealData: Partial<Meal>): Promise<Meal> {
    const meal = this.repository.create(mealData);
    await this.repository.save(meal);
    return meal;
  }

  async updateMeal(id: number, mealData: Partial<Meal>): Promise<Meal | null> {
    let meal = await this.repository.findOneBy({ id });
    if (!meal) {
      return null;
    }

    meal = this.repository.merge(meal, mealData);
    await this.repository.save(meal);
    return meal;
  }
}
