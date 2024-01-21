import { MealRepository } from '../../repositories/MealRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { AppDataSource } from '../../ormconfig';

interface IRequest {
  name: string;
  description: string;
  dateTime: string;
  isDiet: boolean;
}

interface MealResponse {
  id: number;
  name: string;
  description: string;
  dateTime: Date;
  isDiet: boolean;
  user: {
    id: number;
  };
}

export class CreateMealService {
  static execute(mealInput: { name: string; description: string; dateTime: string; isDiet: boolean; }, userId: number) {
    throw new Error('Method not implemented.');
  }
  private mealRepository: MealRepository;
  private userRepository: UserRepository;

  constructor() {
    this.mealRepository = new MealRepository(AppDataSource);
    this.userRepository = new UserRepository(AppDataSource);
  }

  async execute(
    { name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<MealResponse> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found.');
    }

    const meal = await this.mealRepository.createMeal({
      name,
      description,
      dateTime: new Date(dateTime),
      isDiet,
      user,
    });

    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      dateTime: meal.dateTime,
      isDiet: meal.isDiet,
      user: {
        id: user.id,
      },
    };
  }
}
