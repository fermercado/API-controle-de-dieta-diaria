import express from 'express';
import { CreateMealController } from '../controllers/meal/createMeal';
import { authMiddleware } from '../middleware/authMiddleware';
import { UpdateMealController } from '../controllers/meal/UpdateMeal';

const router = express.Router();

router.post('/meals', authMiddleware, (req, res) => {
  const controller = new CreateMealController();
  controller.handle(req, res);
});

router.put('/meals/:id', authMiddleware, (req, res) => {
  const controller = new UpdateMealController();
  controller.handle(req, res);
});

export default router;
