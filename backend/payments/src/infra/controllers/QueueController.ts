import { ProcessPayment } from '../../application/usecases/ProcessPayment';
import { Queue } from '../queue/Queue';

export class QueueController {
  constructor(
    private readonly queue: Queue,
    private readonly processPayment: ProcessPayment
  ) {
    this.queue.consume(
      'ride.finished',
      'ride.finished.process.payment',
      async (payload: any) => {
        await this.processPayment.execute(payload);
      }
    );
  }
}
