import { AppDataSource } from '../../ormconfig';
import { Meal } from '../../entities/Meal';

interface IRequest {
  id: number;
  name?: string;
  description?: string;
  dateTime?: string;
  isDiet?: boolean;
}

export class UpdateMealService {
  async execute(
    { id, name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<Meal | null> {
    const mealRepository = AppDataSource.getRepository(Meal);

    const meal = await mealRepository.findOneBy({ id, user: { id: userId } });
    if (!meal) {
      throw new Error('Meal not found.');
    }

    if (name !== undefined) meal.name = name;
    if (description !== undefined) meal.description = description;
    if (dateTime !== undefined) {
      const convertedDateTime = new Date(dateTime);
      if (isNaN(convertedDateTime.getTime())) {
        throw new Error('Invalid date format.');
      }
      meal.dateTime = convertedDateTime;
    }
    if (isDiet !== undefined) meal.isDiet = isDiet;

    await mealRepository.save(meal);

    return meal;
  }
}
