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
    const meal = await this.mealRepository.findOneBy(id, userId);
    if (!meal) {
      throw new Error('Meal not found.');
    }
    if (meal.user && meal.user.id !== userId) {
      throw new Error('Unauthorized to update this meal.');
    }

    const updatedMealData: Partial<Meal> = {};
    if (name !== undefined) updatedMealData.name = name;
    if (description !== undefined) updatedMealData.description = description;
    if (dateTime !== undefined) updatedMealData.dateTime = new Date(dateTime);
    if (isDiet !== undefined) updatedMealData.isDiet = isDiet;

    return this.mealRepository.updateMeal(id, updatedMealData);
  }
}
