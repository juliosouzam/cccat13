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

  private async getExchange(exchangeName: string, queue?: string) {
    const connection = await this.connect();
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {
      durable: true,
    });
    if (queue) {
      await channel.assertQueue(queue, { durable: true });
      channel.bindQueue(queue, exchangeName, '');
    }

    return channel;
  }

  async publish(exchange: string, payload: any): Promise<void> {
    const channel = await this.getExchange(exchange);
    channel.publish(exchange, '', Buffer.from(JSON.stringify(payload)));
  }

  async consume(
    exchange: string,
    queue: string,
    callback: Function
  ): Promise<void> {
    const channel = await this.getExchange(exchange, queue);
    await channel.consume(queue, async (message) => {
      if (!message) return;
      await callback(JSON.parse(message.content.toString()));
      channel.ack(message);
    });
  }
}
