import { AppDataSource } from '../../ormconfig';
import { Meal } from '../../entities/Meal';

interface IRequest {
  name: string;
  description: string;
  dateTime: string;
  isDiet: boolean;
}

export class CreateMealService {
  async execute(
    { name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<Meal> {
    const mealRepository = AppDataSource.getRepository(Meal);

    const convertedDateTime = new Date(dateTime);
    if (isNaN(convertedDateTime.getTime())) {
      throw new Error('Invalid date format.');
    }

    const meal = mealRepository.create({
      name,
      description,
      dateTime: convertedDateTime,
      isDiet,
      user: { id: userId },
    });

    await mealRepository.save(meal);

    return meal;
  }
}
