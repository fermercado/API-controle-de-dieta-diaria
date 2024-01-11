import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'sqlite',
  database: './database.sqlite',
  entities: ['src/entities/**/*.ts'],
  synchronize: true,
  logging: false,
};

export default config;
