import amqplib from 'amqplib';

async function main() {
  const connection = await amqplib.connect(`amqp://user:password@localhost`);
  const channel = await connection.createChannel();
  await channel.assertQueue('test', {
    durable: true,
  });

  await channel.consume('test', (message) => {
    if (!message) return;
    console.log(JSON.parse(message.content.toString()));
    channel.ack(message);
  });
}

main().catch(console.error);
