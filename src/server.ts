import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { createApp } from './app';

AppDataSource.initialize()
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso.');

    const app = createApp();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });
