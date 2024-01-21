import UserValidator from '../../middleware/UserValidator';

describe('UserValidator', () => {
  describe('validateCreateUser', () => {
    it('should validate a correct user creation object', () => {
      const validUser = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        password: '123456',
        confirmPassword: '123456',
      };
      expect(() => UserValidator.validateCreateUser(validUser)).not.toThrow();
    });

    it('should throw an error if confirmPassword does not match password', () => {
      const invalidUser = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        password: '123456',
        confirmPassword: 'different',
      };
      expect(() => UserValidator.validateCreateUser(invalidUser)).toThrow(
        "Passwords don't match.",
      );
    });
  });

  describe('validateLogin', () => {
    it('should validate a correct login object', () => {
      const validLogin = {
        email: 'joao@example.com',
        password: '123456',
      };
      expect(() => UserValidator.validateLogin(validLogin)).not.toThrow();
    });
  });
});
