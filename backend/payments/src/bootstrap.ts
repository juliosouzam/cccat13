import { ProcessPayment } from './application/usecases/ProcessPayment';
import { QueueController } from './infra/controllers/QueueController';
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter';

async function main() {
  const queue = new RabbitMQAdapter();
  const processPayment = new ProcessPayment(queue);
  new QueueController(queue, processPayment);
}

main().catch(console.error);
