const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
const pokemon = require('./pokemon');

app.use(cors())

app.get('/pokemon', (req, res) => {
  res.json(pokemon);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
