import { PositionRepository } from '../repositories/PositionRepository';
import { RideRepository } from '../repositories/RideRepository';

export interface RepositoryFactory {
  createRideRepository(): RideRepository;
  createPositionRepository(): PositionRepository;
}
