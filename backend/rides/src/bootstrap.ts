import { UpdateRideProjection } from './application/handler/UpdateRideProjection';
import { GetRide } from './application/usecases/GetRide';
import { RequestRide } from './application/usecases/RequestRide';
import { MainController } from './infra/controllers/MainController';
import { QueueController } from './infra/controllers/QueueController';
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from './infra/factory/DatabaseRepositoryFactory';
import { AccountGatewayHttp } from './infra/gateway/AccountGatewayHttp';
import { FastifyAdapter } from './infra/http/FastifyAdapter';
import { FetchAdapter } from './infra/http/FetchAdapter';
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter';

async function main() {
  const queue = new RabbitMQAdapter();
  const connection = new PgPromiseAdapter();
  const httpClient = new FetchAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const getRide = new GetRide(repositoryFactory, accountGateway);
  const requestRide = new RequestRide(repositoryFactory, accountGateway);
  const httpServer = new FastifyAdapter({
    environment: 'development',
  });
  const updateRideProjection = new UpdateRideProjection(
    repositoryFactory,
    accountGateway,
    connection
  );
  new MainController(httpServer, requestRide, getRide, queue);
  new QueueController(queue, updateRideProjection);
  await httpServer.listen(process.env.PORT ? Number(process.env.PORT) : 3334);
}

main().catch(console.error);
