import { GetAccount } from './application/usecases/GetAccount';
import { SignUp } from './application/usecases/SignUp';
import { MainController } from './infra/controllers/MainController';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from './infra/factory/DatabaseRepositoryFactory';
import { FastifyAdapter } from './infra/http/FastifyAdapter';

async function main() {
  const connection = new PgPromiseAdapter();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const signup = new SignUp(repositoryFactory);
  const getAccount = new GetAccount(repositoryFactory);
  const httpServer = new FastifyAdapter({
    environment: 'development',
  });

  new MainController(httpServer, signup, getAccount);
  await httpServer.listen(process.env.PORT ? Number(process.env.PORT) : 3333);
}

main().catch(console.error);
