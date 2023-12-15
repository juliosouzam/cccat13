import { Queue } from '../../infra/queue/Queue';

const sleep = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export class ProcessPayment {
  constructor(private readonly queue: Queue) {}

  async execute(input: any): Promise<void> {
    await sleep(2000);
    console.log('ProcessPayment', input);

    await this.queue.publish('payment.approved', {
      paymentId: '1234567',
      status: 'approved',
    });
  }
}
