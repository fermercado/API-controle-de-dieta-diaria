import { MealRepository } from '../../repositories/MealRepository';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Meal } from '../../entities/Meal';
import { User } from '../../entities/User';

jest.mock('../../entities/User', () => ({
  User: class MockUser {},
}));
jest.mock('../../entities/Meal', () => ({
  Meal: class MockMeal {},
}));

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    getRepository: jest.fn(),
  })),
}));

describe('MealRepository', () => {
  let mealRepository: MealRepository;
  let mockRepository: jest.Mocked<Repository<Meal>>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn((meal: Meal, mealData: Partial<Meal>) => ({
        ...meal,
        ...mealData,
      })),
      save: jest.fn(),
    } as any;

    const mockDataSource = new DataSource({} as any);
    mockDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);
    mealRepository = new MealRepository(mockDataSource);
  });

  describe('createMeal', () => {
    it('should create and save a meal', async () => {
      const mealData: Meal = {
        id: 1,
        name: 'Salad',
        description: 'Fresh salad',
        dateTime: new Date(),
        isDiet: false,
        user: new User(),
      };
      mockRepository.create.mockReturnValue(mealData);
      mockRepository.save.mockResolvedValue(mealData as Meal);

      const result = await mealRepository.createMeal(mealData);

      expect(mockRepository.create).toHaveBeenCalledWith(mealData);
      expect(mockRepository.save).toHaveBeenCalledWith(mealData);
      expect(result).toEqual(mealData);
    });
  });

  describe('updateMeal', () => {
    it('should update and save a meal', async () => {
      const mealData: Partial<Meal> = {
        name: 'Updated Salad',
        description: 'Fresh salad',
      };

      const existingMeal: Meal = {
        id: 1,
        name: 'Salad',
        description: 'Old salad',
        dateTime: new Date(),
        isDiet: false,
        user: new User(),
      };

      mockRepository.findOneBy.mockResolvedValue(existingMeal);

      mockRepository.merge.mockImplementation(
        (meal: Meal, ...mealData: DeepPartial<Meal>[]) => {
          return Object.assign(meal, ...mealData);
        },
      );

      const result = await mealRepository.updateMeal(1, mealData);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingMeal, mealData);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existingMeal,
        ...mealData,
      });
      expect(result).toEqual({ ...existingMeal, ...mealData });
    });
  });

  describe('deleteMeal', () => {
    it('should delete a meal', async () => {
      const meal = { id: 1, user: { id: 1 } } as Meal;
      mockRepository.findOneBy.mockResolvedValue(meal);

      const result = await mealRepository.deleteMeal(1, 1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        user: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(meal);
      expect(result).toBe(true);
    });
  });

  describe('GetUserMeal', () => {
    it('should retrieve user meals', async () => {
      const userId = 1;
      const userMeals = [
        { id: 1, name: 'Meal 1' },
        { id: 2, name: 'Meal 2' },
      ] as Meal[];
      mockRepository.find.mockResolvedValue(userMeals);

      const result = await mealRepository.GetUserMeal(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result).toEqual(userMeals);
    });
  });
  describe('updateMeal', () => {
    it('should return null if meal is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await mealRepository.updateMeal(1, {
        name: 'Updated Meal',
      });

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });
  describe('deleteMeal', () => {
    it('should return false if meal is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await mealRepository.deleteMeal(1, 1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        user: { id: 1 },
      });
      expect(result).toBeFalsy();
    });
  });
  describe('findOneBy', () => {
    it('should call repository findOne with correct arguments', async () => {
      const arg = { id: 1, user: { id: 1 } };
      mockRepository.findOne.mockResolvedValue(null);

      const result = await mealRepository.findOneBy(arg);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: arg });
      expect(result).toBeNull();
    });
  });
});
