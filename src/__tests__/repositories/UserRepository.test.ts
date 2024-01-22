import { UserRepository } from '../../repositories/UserRepository';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
    } as any;

    userRepository = new UserRepository({
      getRepository: () => mockRepository,
    } as any);
  });

  describe('findOneBy', () => {
    it('should call findOneBy with correct criteria', async () => {
      const criteria = { id: 1 };
      await userRepository.findOneBy(criteria);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith(criteria);
    });
  });

  describe('findByEmail', () => {
    it('should call findOne with correct email', async () => {
      const email = 'test@example.com';
      await userRepository.findByEmail(email);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });
});
