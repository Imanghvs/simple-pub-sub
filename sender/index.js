const express = require('express');
const amqp = require('amqplib');

const EXCHANGE = 'ImanMessenger';

const app = express();
const port = 3000;

app.use(express.json());

const connect = async () => {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: false });
  return channel;
};

const setupServer = async () => {
  const channel = await connect();
  app.post('/:topic/', async (req, res) => {
    const { topic } = req.params;
    const { message } = req.body;
    channel.assertExchange(EXCHANGE, 'direct', { durable: false });
    channel.publish(EXCHANGE, topic, Buffer.from(message));
    console.log(' [x] Sent %s', message);
    res.send(`message "${message}" sent to ${topic}`);
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

setupServer();
