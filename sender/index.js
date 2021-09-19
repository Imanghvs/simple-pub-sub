const express = require('express');
const amqp = require('amqplib');

const EXCHANGE = 'ImanMessenger';

const app = express();
const port = 3000;

app.use(express.json());

const connect = async () => {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: false });
  return channel;
};

const setupServer = async () => {
  const channel = await connect();
  app.post('/:key/', async (req, res) => {
    const { key } = req.params;
    const { message } = req.body;
    channel.publish(EXCHANGE, key, Buffer.from(message));
    console.log(' [x] Sent %s', message);
    res.send(`message "${message}" sent to ${key}`);
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

setupServer();
