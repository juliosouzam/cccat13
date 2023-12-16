import { Connection } from '../../infra/database/Connection';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountGateway } from '../gateway/AccountGateway';
import { RideRepository } from '../repositories/RideRepository';

export class UpdateRideProjection {
  private rideRepository: RideRepository;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly accountGateway: AccountGateway,
    private readonly connection: Connection
  ) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
  }

  async execute(input: Input) {
    console.log('UpdateRideProjection', input);
    const ride = await this.rideRepository.getById(input.rideId);
    const account = await this.accountGateway.getById(ride.passengerId);
    if (!account) throw new Error('Account not found');

    // should save in mongodb, redis, dynamodb...
    await this.connection.query(
      'INSERT INTO ride_projections (ride_id, passenger_name, passenger_email, status) VALUES ($1, $2, $3, $4)',
      [ride.rideId, account.name, account.email, ride.getStatus()]
    );
  }
}

type Input = {
  rideId: string;
  fare: number;
};
