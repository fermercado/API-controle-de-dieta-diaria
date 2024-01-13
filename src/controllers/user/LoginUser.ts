import { Request, Response } from 'express';
import { LoginService } from '../../services/user/LoginService';
import UserValidator from '../../middleware/UserValidator';
import { ZodError } from 'zod';

export class LoginUser {
  private LoginService = new LoginService();

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const loginData = UserValidator.validateLogin(req.body);
      const tokenOrError = await this.LoginService.validateUser(
        loginData.email,
        loginData.password,
      );

      if (tokenOrError instanceof Error) {
        return res.status(401).json({ message: tokenOrError.message });
      }

      return res.json(tokenOrError);
    } catch (error) {
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

export default new LoginUser();
