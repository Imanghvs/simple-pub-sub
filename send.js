const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Your name and at least one word for messaging is required.');
  process.exit(-1);
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) { throw error1; }

    const exchange = 'ImanMessenger';
    const name = args[0];
    const msg = args.slice(1).join(' ');

    channel.assertExchange(exchange, 'direct', { durable: false });
    channel.publish(exchange, name, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
