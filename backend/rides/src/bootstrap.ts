import { GetRide } from './application/usecases/GetRide';
import { RequestRide } from './application/usecases/RequestRide';
import { MainController } from './infra/controllers/MainController';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from './infra/factory/DatabaseRepositoryFactory';
import { FastifyAdapter } from './infra/http/FastifyAdapter';

async function main() {
  const connection = new PgPromiseAdapter();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const getRide = new GetRide(repositoryFactory);
  const requestRide = new RequestRide(repositoryFactory);
  const httpServer = new FastifyAdapter({
    environment: 'development',
  });

  new MainController(httpServer, requestRide, getRide);
  await httpServer.listen(process.env.PORT ? Number(process.env.PORT) : 3334);
}

main().catch(console.error);
