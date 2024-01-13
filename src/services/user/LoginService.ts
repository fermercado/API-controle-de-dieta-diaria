import { AppDataSource } from '../../ormconfig';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type LoginResponse = {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export class LoginService {
  private userRepository = AppDataSource.getRepository(User);

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginResponse | Error> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Error('Incorrect email or password.');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
        expiresIn: '1d',
      });

      return {
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error) {
      console.error(error);
      return new Error('Error validating user.');
    }
  }
}

export default new LoginService();
