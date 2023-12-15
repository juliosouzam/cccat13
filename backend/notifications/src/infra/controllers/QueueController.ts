import { SendNotification } from '../../application/usecases/SendNotification';
import { Queue } from '../queue/Queue';

export class QueueController {
  constructor(
    private readonly queue: Queue,
    private readonly sendNotification: SendNotification
  ) {
    this.queue.consume('send.notification', async (payload: any) => {
      await this.sendNotification.execute(payload);
    });
  }
}
