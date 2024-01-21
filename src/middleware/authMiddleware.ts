import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: 'Invalid Token.' });
    }

    if (decoded && typeof decoded === 'object' && 'id' in decoded) {
      req.userId = decoded.id;
      next();
    } else {
      return res.status(401).send({ message: 'Invalid Token.' });
    }
  });
};
