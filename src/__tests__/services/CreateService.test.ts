import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../ormconfig';
import { User } from '../../entities/User';
import { CreateService } from '../../services/user/CreateService';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

interface MockRepositoryMethods {
  findOne: jest.Mock;
  save: jest.Mock;
}

describe('CreateService', () => {
  let createService: CreateService;
  let mockRepositoryMethods: MockRepositoryMethods;

  beforeEach(() => {
    mockRepositoryMethods = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue({
      ...mockRepositoryMethods,
    } as unknown as Repository<User>);

    createService = new CreateService();
  });

  it('should create a new user with valid data', async () => {
    const mockUser = {
      id: 1,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
    };

    mockRepositoryMethods.findOne.mockResolvedValue(null);
    mockRepositoryMethods.save.mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const response = await createService.createUser(
      'João',
      'Silva',
      'joao@example.com',
      'password',
    );

    expect(mockRepositoryMethods.findOne).toHaveBeenCalledWith({
      where: { email: 'joao@example.com' },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 8);
    expect(mockRepositoryMethods.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
      }),
    );
    expect(response).toEqual(mockUser);
  });

  it('should return an error if email already exists', async () => {
    mockRepositoryMethods.findOne.mockResolvedValue({});

    const response = await createService.createUser(
      'Maria',
      'Silva',
      'maria@example.com',
      'password',
    );

    if (response instanceof Error) {
      expect(response.message).toBe('Email already exists.');
    } else {
      fail('Response should be an instance of Error');
    }
  });

  it('should return an error on unexpected exceptions', async () => {
    mockRepositoryMethods.findOne.mockRejectedValue(
      new Error('Database error'),
    );

    const response = await createService.createUser(
      'Maria',
      'Silva',
      'maria@example.com',
      'password',
    );

    if (response instanceof Error) {
      expect(response.message).toBe('Error creating user.');
    } else {
      fail('Response should be an instance of Error');
    }
  });
});
