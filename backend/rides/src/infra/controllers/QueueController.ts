import { RequestRide } from '../../application/usecases/RequestRide';
import { Queue } from '../queue/Queue';

export class QueueController {
  constructor(
    private readonly queue: Queue,
    private readonly requestRide: RequestRide
  ) {
    this.queue.consume('request.ride', async (payload: any) => {
      await this.requestRide.execute(payload);
    });
  }
}
