const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('At least one name is required.');
  process.exit(-1);
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    const exchange = 'ImanMessenger';

    channel.assertExchange(exchange, 'direct', { durable: false });

    channel.assertQueue('', { exclusive: true }, (error2, q) => {
      if (error2) throw error2;
      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        q.queue,
      );
      args.forEach((arg) => {
        channel.bindQueue(q.queue, exchange, arg);
      });

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
    });
  });
});
