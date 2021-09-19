const express = require('express');
const amqp = require('amqplib/callback_api');

let ch = null;
const exchange = 'ImanMessenger';

amqp.connect('amqp://rabbitmq', (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) { throw error1; }

    channel.assertExchange(exchange, 'direct', { durable: false });
    ch = channel;
  });
});

const app = express();
const port = 3000;

app.use(express.json());

app.post('/:topic/', async (req, res) => {
  const { topic } = req.params;
  const { message } = req.body;
  await ch.publish(exchange, topic, Buffer.from(message));
  console.log(' [x] Sent %s', message);
  res.send(`message "${message}" sent to ${topic}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
