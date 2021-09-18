const express = require('express');
const { publishToQueue } = require('./service');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/:name/', async (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  await publishToQueue(name, message);
  res.send(`message "${message}" sent to ${name}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
