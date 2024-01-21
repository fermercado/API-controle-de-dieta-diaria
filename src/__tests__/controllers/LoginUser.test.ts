import { Request, Response } from 'express';
import { LoginUser } from '../../controllers/user/LoginUser';
import { LoginService } from '../../services/user/LoginService';
import UserValidator from '../../middleware/UserValidator';
import { ZodError, ZodIssue } from 'zod';

jest.mock('../../services/user/LoginService');
jest.mock('../../middleware/UserValidator');

describe('LoginUser', () => {
  let loginUser: LoginUser;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    loginUser = new LoginUser();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      status: mockStatus,
      json: mockSend,
    };
    mockReq = {
      body: { email: 'user@example.com', password: 'password' },
    };
  });

  it('should successfully login a user', async () => {
    (LoginService.prototype.validateUser as jest.Mock).mockResolvedValue({
      token: 'fakeToken',
    });
    (UserValidator.validateLogin as jest.Mock).mockReturnValue(mockReq.body);

    await loginUser.handle(mockReq as Request, mockRes as Response);

    expect(mockSend).toHaveBeenCalledWith({ token: 'fakeToken' });
  });
  it('should handle authentication errors', async () => {
    const authenticationError = new Error('Authentication failed');
    (LoginService.prototype.validateUser as jest.Mock).mockResolvedValue(
      authenticationError,
    );
    (UserValidator.validateLogin as jest.Mock).mockReturnValue(mockReq.body);

    await loginUser.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockSend).toHaveBeenCalledWith({
      message: authenticationError.message,
    });
  });

  it('should handle authentication errors', async () => {
    const authenticationError = new Error('Authentication failed');
    (LoginService.prototype.validateUser as jest.Mock).mockResolvedValue(
      authenticationError,
    );

    await loginUser.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockSend).toHaveBeenCalledWith({
      message: authenticationError.message,
    });
  });

  it('should handle unexpected server errors', async () => {
    (UserValidator.validateLogin as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await loginUser.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
  it('should handle login validation errors', async () => {
    const zodIssues: ZodIssue[] = [
      {
        path: ['email'],
        message: 'Invalid email format',
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
      },
    ];
    const zodError = new ZodError(zodIssues);

    jest.spyOn(UserValidator, 'validateLogin').mockImplementation(() => {
      throw zodError;
    });

    await loginUser.handle(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      errors: zodIssues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  });
});
