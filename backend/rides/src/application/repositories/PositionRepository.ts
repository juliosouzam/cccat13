import { Position } from '../../domain/Position';

export interface PositionRepository {
  save(position: Position): Promise<void>;
  getByRideId(rideId: string): Promise<Position[]>;
}
