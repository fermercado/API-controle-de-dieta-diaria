import { MealRepository } from '../../repositories/MealRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { Meal } from '../../entities/Meal';

interface IRequest {
  id: number;
  name?: string;
  description?: string;
  dateTime?: string;
  isDiet?: boolean;
}

export class UpdateMealService {
  private mealRepository: MealRepository;
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository, mealRepository: MealRepository) {
    this.userRepository = userRepository;
    this.mealRepository = mealRepository;
  }

  async execute(
    { id, name, description, dateTime, isDiet }: IRequest,
    userId: number,
  ): Promise<Meal | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found.');
    }

    const updatedMealData: Partial<Meal> = {};
    if (name !== undefined) updatedMealData.name = name;
    if (description !== undefined) updatedMealData.description = description;
    if (dateTime !== undefined) updatedMealData.dateTime = new Date(dateTime);
    if (isDiet !== undefined) updatedMealData.isDiet = isDiet;

    return this.mealRepository.updateMeal(id, {
      ...updatedMealData,
    });
  }
}
