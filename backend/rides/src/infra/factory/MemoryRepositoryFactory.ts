import { RepositoryFactory } from '../../application/factory/RepositoryFactory';
import { PositionRepository } from '../../application/repositories/PositionRepository';
import { RideRepository } from '../../application/repositories/RideRepository';

export class MemoryRepositoryFactory implements RepositoryFactory {
  createRideRepository(): RideRepository {
    throw new Error('Method not implemented.');
  }

  createPositionRepository(): PositionRepository {
    throw new Error('Method not implemented.');
  }
}
