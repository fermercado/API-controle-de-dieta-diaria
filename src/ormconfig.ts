import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Meal } from './entities/Meal';

const databaseUrl = process.env.DATABASE_URL || 'fallback-database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databaseUrl,
  entities: [User, Meal],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
