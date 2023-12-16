import { GetAccount } from './application/usecases/GetAccount';
import { SignUp } from './application/usecases/SignUp';
import { VerifyToken } from './application/usecases/VerifyToken';
import { MainController } from './infra/controllers/MainController';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from './infra/factory/DatabaseRepositoryFactory';
import { FastifyAdapter } from './infra/http/FastifyAdapter';
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter';

async function main() {
  const connection = new PgPromiseAdapter();
  const queue = new RabbitMQAdapter();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const signup = new SignUp(repositoryFactory, queue);
  const getAccount = new GetAccount(repositoryFactory);
  const verifyToken = new VerifyToken();
  const httpServer = new FastifyAdapter({
    environment: 'development',
  });

  new MainController(httpServer, signup, getAccount, verifyToken);
  await httpServer.listen(process.env.PORT ? Number(process.env.PORT) : 3333);
}

main().catch(console.error);
