import express from 'express';
import { CreateMealController } from '../controllers/meal/createMeal';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/meals', authMiddleware, (req, res) => {
  const controller = new CreateMealController();
  controller.handle(req, res);
});

export default router;
