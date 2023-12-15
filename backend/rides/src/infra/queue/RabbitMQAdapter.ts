import amqplib from 'amqplib';

import { Queue } from './Queue';

export class RabbitMQAdapter implements Queue {
  private async connect() {
    return amqplib.connect(`amqp://user:password@localhost`);
  }

  private async getChannel(queue: string) {
    const connection = await this.connect();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    return channel;
  }

  async publish(queue: string, payload: any): Promise<void> {
    const channel = await this.getChannel(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
  }

  async consume(queue: string, callback: Function): Promise<void> {
    const channel = await this.getChannel(queue);

    await channel.consume(queue, async (message) => {
      if (!message) return;
      await callback(JSON.parse(message.content.toString()));
      channel.ack(message);
    });
  }
}
