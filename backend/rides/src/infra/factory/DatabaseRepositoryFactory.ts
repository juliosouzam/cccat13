import { RepositoryFactory } from '../../application/factory/RepositoryFactory';
import { PositionRepository } from '../../application/repositories/PositionRepository';
import { RideRepository } from '../../application/repositories/RideRepository';
import { Connection } from '../database/Connection';
import { PositionRepositoryDatabase } from '../repositories/PositionRepositoryDatabase';
import { RideRepositoryDatabase } from '../repositories/RideRepositoryDatabase';

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(private readonly connection: Connection) {}

  createRideRepository(): RideRepository {
    return new RideRepositoryDatabase(this.connection);
  }

  createPositionRepository(): PositionRepository {
    return new PositionRepositoryDatabase(this.connection);
  }
}
