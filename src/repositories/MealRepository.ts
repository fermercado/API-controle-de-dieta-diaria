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
}
