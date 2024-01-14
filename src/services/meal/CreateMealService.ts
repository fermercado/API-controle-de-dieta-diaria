import { AppDataSource } from '../../ormconfig';
import { Meal } from '../../entities/Meal';

interface IRequest {
  name: string;
  description: string;
  dateTime: Date;
  isDiet: boolean;
}

export class CreateMealService {
  async execute(
    { name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<Meal> {
    const mealRepository = AppDataSource.getRepository(Meal);

    const meal = mealRepository.create({
      name,
      description,
      dateTime,
      isDiet,
      user: { id: userId },
    });

    await mealRepository.save(meal);

    return meal;
  }
}
