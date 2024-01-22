import { DataSource } from 'typeorm';
import { LoginService } from '../../services/user/LoginService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../../repositories/UserRepository', () => {
  const mock = {
    findByEmail: jest.fn(),
  };
  return { UserRepository: jest.fn(() => mock) };
});

describe('LoginService', () => {
  let loginService: LoginService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    const mockDataSource = {};

    loginService = new LoginService();
    mockUserRepository = new UserRepository(
      mockDataSource as unknown as DataSource,
    ) as jest.Mocked<UserRepository>;
    jest.clearAllMocks();
  });
  it('should authenticate a user with correct credentials', async () => {
    const mockUser: User = {
      id: 123,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'hashedpassword',
      meals: [],
      validatePassword: async () => true,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

    const response = await loginService.validateUser(
      'joao@example.com',
      'password',
    );

    expect(response).toEqual({
      token: 'mockedToken',
      user: {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      },
    });
  });
  it('should return an error for non-existent user or incorrect password', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await loginService.validateUser(
      'invalid@example.com',
      'password',
    );

    expect(response).toBeInstanceOf(Error);
    if (response instanceof Error) {
      expect(response.message).toBe('Incorrect email or password.');
    }
  });
  it('should return an error for any exception during user validation', async () => {
    mockUserRepository.findByEmail.mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await loginService.validateUser(
      'joao@example.com',
      'password',
    );

    expect(response).toBeInstanceOf(Error);
    if (response instanceof Error) {
      expect(response.message).toBe('Error validating user.');
    }
  });
});
