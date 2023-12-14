import { RepositoryFactory } from '../factory/RepositoryFactory';
import { PositionRepository } from '../repositories/PositionRepository';
import { RideRepository } from '../repositories/RideRepository';

export class FinishRide {
  private rideRepository: RideRepository;
  private positionRepository: PositionRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.positionRepository = this.repositoryFactory.createPositionRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    const positions = await this.positionRepository.getByRideId(ride.rideId);
    ride.finish(positions);
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
};
