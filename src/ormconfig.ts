import { DataSource } from 'typeorm';
import { User } from './entities/User';

const databaseUrl = process.env.DATABASE_URL || 'fallback-database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databaseUrl,
  entities: [User],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
