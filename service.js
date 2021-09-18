const amqp = require('amqplib/callback_api');

let ch = null;
const exchange = 'ImanMessenger';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) { throw error1; }

    channel.assertExchange(exchange, 'direct', { durable: false });
    ch = channel;
  });
});

const publishToQueue = async (name, message) => {
  ch.publish(exchange, name, Buffer.from(message));
  console.log(' [x] Sent %s', message);
};

module.exports = {
  publishToQueue,
};
