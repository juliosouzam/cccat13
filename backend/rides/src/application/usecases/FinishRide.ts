// import { PaymentGatewayHttp } from '../../infra/gateway/PaymentGatewayHttp';
// import { FetchAdapter } from '../../infra/http/FetchAdapter';
import { Queue } from '../../infra/queue/Queue';
import { RabbitMQAdapter } from '../../infra/queue/RabbitMQAdapter';
import { RepositoryFactory } from '../factory/RepositoryFactory';
// import { PaymentGateway } from '../gateway/PaymentGateway';
import { PositionRepository } from '../repositories/PositionRepository';
import { RideRepository } from '../repositories/RideRepository';

export class FinishRide {
  private rideRepository: RideRepository;
  private positionRepository: PositionRepository;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    // private readonly paymentGateway: PaymentGateway = new PaymentGatewayHttp(
    //   new FetchAdapter()
    // ),
    private readonly queue: Queue = new RabbitMQAdapter()
  ) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.positionRepository = this.repositoryFactory.createPositionRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    const positions = await this.positionRepository.getByRideId(ride.rideId);
    ride.finish(positions);
    await this.rideRepository.update(ride);

    // await this.paymentGateway.process({
    //   rideId: ride.rideId,
    //   fare: ride.getFare(),
    // });

    await this.queue.publish('ride.finished', {
      rideId: ride.rideId,
      fare: ride.getFare(),
    });
  }
}

type Input = {
  rideId: string;
};
