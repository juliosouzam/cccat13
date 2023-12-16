import { UpdateRideProjection } from '../../application/handler/UpdateRideProjection';
import { Queue } from '../queue/Queue';

export class QueueController {
  constructor(
    private readonly queue: Queue,
    private readonly updateRideProjection: UpdateRideProjection
  ) {
    this.queue.consume(
      'ride.finished',
      'ride.finished.update.ride.projection',
      async (payload: any) => {
        await this.updateRideProjection.execute(payload);
      }
    );
  }
}
