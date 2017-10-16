const express = require('express');
const path = require('path');
const check = require('./check.js');

const app = express();

app.use(express.static(path.resolve('./static')));

app.get('/', (req, res, next) => {
  try {
    // get user-agent header
    const userAgent = req.headers['user-agent'];
    const html = check(userAgent);
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${(process.env.PORT || 3000)}`);
});
