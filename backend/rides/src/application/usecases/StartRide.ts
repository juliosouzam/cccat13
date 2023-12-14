import { RepositoryFactory } from '../factory/RepositoryFactory';
import { RideRepository } from '../repositories/RideRepository';

export class StartRide {
  private rideRepository: RideRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    ride.start();

    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
};
