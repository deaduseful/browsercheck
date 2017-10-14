const express = require('express');
const path = require('path');
const check = require('./check.js');

const app = express();

app.use(express.static(path.resolve('./static')));

app.get('/', (req, res, next) => {
  try {
    const html = check(req);
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${(process.env.PORT || 3000)}`);
});
