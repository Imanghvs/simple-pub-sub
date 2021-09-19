const amqp = require('amqplib');

const topic = process.env.TOPIC || 'iman';
const EXCHANGE = 'ImanMessenger';

const connect = async () => {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  console.log(
    ' [*] Waiting for messages in %s. To exit press CTRL+C',
    q.queue,
  );
  await channel.bindQueue(q.queue, EXCHANGE, topic);
  channel.consume(
    q.queue,
    (msg) => {
      console.log(
        " [x] %s: '%s'",
        msg.fields.routingKey,
        msg.content.toString(),
      );
    },
    { noAck: true },
  );
};

connect();
