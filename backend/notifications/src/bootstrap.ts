import { SendNotification } from './application/usecases/SendNotification';
import { QueueController } from './infra/controllers/QueueController';
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter';

async function main() {
  const queue = new RabbitMQAdapter();
  const sendNotification = new SendNotification();
  new QueueController(queue, sendNotification);
}

main().catch(console.error);
