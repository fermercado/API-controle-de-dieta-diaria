import { Request, Response } from 'express';
import { CreateService } from '../../services/user/CreateService';
import UserValidator from '../../middleware/UserValidator';
import { ZodError } from 'zod';

export class CreateUser {
  private CreateService = new CreateService();

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = UserValidator.validateCreateUser(req.body);

      const { firstName, lastName, email, password } = validatedData;

      const userResponse = await this.CreateService.createUser(
        firstName,
        lastName,
        email,
        password,
      );

      if (userResponse instanceof Error) {
        return res.status(409).json({ message: userResponse.message });
      }

      return res.status(201).json(userResponse);
    } catch (error) {
      console.error('CreateUser.handle - Error:', error);
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new CreateUser();
