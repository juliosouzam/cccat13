import { PositionRepository } from '../../application/repositories/PositionRepository';
import { Coord } from '../../domain/Coord';
import { Position } from '../../domain/Position';
import { Connection } from '../database/Connection';

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(private readonly connection: Connection) {}

  async save(position: Position): Promise<void> {
    await this.connection.query(
      'insert into cccat13.positions (id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ]
    );
  }

  async getByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      'select * from cccat13.positions where ride_id = $1',
      [rideId]
    );
    const positions: Position[] = [];
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          positionData.id,
          positionData.ride_id,
          new Coord(
            parseFloat(positionData.lat),
            parseFloat(positionData.long)
          ),
          positionData.date
        )
      );
    }

    return positions;
  }
}
