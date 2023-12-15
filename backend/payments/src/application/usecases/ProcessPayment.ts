import { Queue } from '../../infra/queue/Queue';

export class ProcessPayment {
  constructor(private readonly queue: Queue) {}

  async execute(input: any): Promise<void> {
    console.log('ProcessPayment', input);

    await this.queue.publish('payment.approved', {
      paymentId: '1234567',
      status: 'approved',
    });
  }
}
