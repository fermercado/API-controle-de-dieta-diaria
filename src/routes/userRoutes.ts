import express from 'express';
import CreateUser from '../controllers/user/CreateUser';
import LoginUser from '../controllers/user/LoginUser';

const router = express.Router();

router.post('/users', (req, res) => CreateUser.handle(req, res));

router.post('/users/login', (req, res) => LoginUser.handle(req, res));

export default router;
