import express from 'express';
import { CreateMealController } from '../controllers/meal/CreateMeal';
import { authMiddleware } from '../middleware/authMiddleware';
import { UpdateMealController } from '../controllers/meal/UpdateMeal';
import { DeleteMealController } from '../controllers/meal/DeleteMeal';
import { GetUserMealsController } from '../controllers/meal/GetUserMeal';
import { GetUserMealsService } from '../services/meal/GetUserMealsService';
import { GetMealController } from '../controllers/meal/GetMeal';

const router = express.Router();

router.post('/meals', authMiddleware, (req, res) => {
  const controller = new CreateMealController();
  controller.handle(req, res);
});

router.put('/meals/:id', authMiddleware, (req, res) => {
  const controller = new UpdateMealController();
  controller.handle(req, res);
});

router.delete('/meals/:id', authMiddleware, (req, res) => {
  const controller = new DeleteMealController();
  controller.handle(req, res);
});

router.get('/meals', authMiddleware, (req, res) => {
  const getUserMealsService = new GetUserMealsService();
  const controller = new GetUserMealsController(getUserMealsService);
  controller.handle(req, res);
});

router.get('/meals/:id', authMiddleware, (req, res) => {
  const controller = new GetMealController();
  controller.handle(req, res);
});

export default router;
