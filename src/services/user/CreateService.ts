import { AppDataSource } from '../../ormconfig';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';

type UserResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

class StringFormatter {
  static capitalizeFirstLetter(string: string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

export class CreateService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<UserResponse | Error> {
    try {
      const formattedFirstName =
        StringFormatter.capitalizeFirstLetter(firstName);
      const formattedLastName = StringFormatter.capitalizeFirstLetter(lastName);

      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        return new Error('Email already exists.');
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = new User();
      newUser.firstName = formattedFirstName;
      newUser.lastName = formattedLastName;
      newUser.email = email;
      newUser.password = hashedPassword;

      const user = await this.userRepository.save(newUser);

      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return userResponse;
    } catch (error) {
      return new Error('Error creating user.');
    }
  }
}

export default new CreateService();
