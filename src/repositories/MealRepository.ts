import { DataSource, Repository } from 'typeorm';
import { Meal } from '../entities/Meal';

export class MealRepository {
  private repository: Repository<Meal>;
  findOne: any;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Meal);
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

  async deleteMeal(mealId: number, userId: number): Promise<boolean> {
    const meal = await this.repository.findOneBy({
      id: mealId,
      user: { id: userId },
    });
    if (!meal) {
      return false;
    }

    await this.repository.remove(meal);
    return true;
  }

  async GetUserMeal(userId: number): Promise<Meal[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async findOneBy(mealId: number, userId: number): Promise<Meal | null> {
    return await this.repository.findOne({
      where: {
        id: mealId,
        user: { id: userId },
      },
    });
  }
}
