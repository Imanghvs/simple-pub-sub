const amqp = require('amqplib/callback_api');

const topic = process.env.TOPIC || 'iman';

amqp.connect('amqp://rabbitmq', (error0, connection) => {
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
      channel.bindQueue(q.queue, exchange, topic);

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
