import { Position } from '../../domain/Position';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { PositionRepository } from '../repositories/PositionRepository';
import { RideRepository } from '../repositories/RideRepository';

export class UpdatePosition {
  private rideRepository: RideRepository;
  private positionRepository: PositionRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.positionRepository = this.repositoryFactory.createPositionRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    if (ride.getStatus() !== 'in_progress') throw new Error();
    const position = Position.create(ride.rideId, input.lat, input.long);
    await this.positionRepository.save(position);
  }
}

type Input = {
  rideId: string;
  lat: number;
  long: number;
};
