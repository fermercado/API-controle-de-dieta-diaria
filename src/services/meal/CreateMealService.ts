import { MealRepository } from '../../repositories/MealRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { Meal } from '../../entities/Meal';
import { AppDataSource } from '../../ormconfig';

interface IRequest {
  name: string;
  description: string;
  dateTime: string;
  isDiet: boolean;
}

export class CreateMealService {
  private mealRepository: MealRepository;
  private userRepository: UserRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
    this.userRepository = new UserRepository(AppDataSource);
  }

  async execute(
    { name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<Meal> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found.');
    }

    return this.mealRepository.createMeal({
      name,
      description,
      dateTime: new Date(dateTime),
      isDiet,
      user,
    });
  }
}
