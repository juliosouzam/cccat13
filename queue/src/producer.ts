import amqplib from 'amqplib';

async function main() {
  const connection = await amqplib.connect(`amqp://user:password@localhost`);
  const channel = await connection.createChannel();
  await channel.assertQueue('test', {
    durable: true,
  });

  const input = {
    rideId: '12345678',
    fare: 10,
  };
  await channel.sendToQueue('test', Buffer.from(JSON.stringify(input)));
}

main().catch(console.error);
