import { CreateUser } from '../../controllers/user/CreateUser';
import { CreateService } from '../../services/user/CreateService';
import UserValidator from '../../middleware/UserValidator';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

jest.mock('../../services/user/CreateService');
jest.mock('../../middleware/UserValidator');

describe('CreateUser', () => {
  let consoleSpy: jest.SpyInstance<
    void,
    [message?: any, ...optionalParams: any[]],
    any
  >;
  let createUserController: CreateUser;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    createUserController = new CreateUser();
    mockRequest = { body: {} as any };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return a validation error for invalid data', async () => {
    const error = new ZodError([
      {
        message: 'Invalid data',
        path: ['firstName'],
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ]);
    (UserValidator.validateCreateUser as jest.Mock).mockImplementation(() => {
      throw error;
    });

    mockRequest.body = {};

    await createUserController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: error.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  });

  it('should handle service errors', async () => {
    const validatedData = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joão@example.com',
      password: 'password123',
    };
    (UserValidator.validateCreateUser as jest.Mock).mockReturnValue(
      validatedData,
    );

    const createUserMock = CreateService.prototype.createUser as jest.Mock;
    createUserMock.mockRejectedValue(new Error('Service error'));

    mockRequest.body = validatedData;

    await createUserController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });

  it('should successfully create a user', async () => {
    const userResponse = {
      id: '1',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joão@example.com',
    };
    const createUserMock = CreateService.prototype.createUser as jest.Mock;
    createUserMock.mockResolvedValue(userResponse);

    mockRequest.body = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joão@example.com',
      password: 'password123',
    };

    await createUserController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
  });

  it('should return an error if the user creation fails', async () => {
    const createUserMock = CreateService.prototype.createUser as jest.Mock;
    createUserMock.mockResolvedValue(new Error('User creation failed'));

    mockRequest.body = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joão@example.com',
      password: 'password123',
    };

    await createUserController.handle(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User creation failed',
    });
  });
  it('should log an error for ZodError', async () => {
    const error = new ZodError([
      {
        message: 'Invalid data',
        path: ['firstName'],
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ]);
    (UserValidator.validateCreateUser as jest.Mock).mockImplementation(() => {
      throw error;
    });

    mockRequest.body = {
      firstName: 123,
    };

    const consoleSpy = jest.spyOn(console, 'error');

    await createUserController.handle(mockRequest as any, mockResponse as any);

    expect(consoleSpy).toHaveBeenCalledWith(
      'CreateUser.handle - Error:',
      error,
    );

    consoleSpy.mockRestore();
  });
});
