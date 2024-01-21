import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findOneBy(criteria: any): Promise<User | null> {
    return this.repository.findOneBy(criteria);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}
