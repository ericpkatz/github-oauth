const express = require('express');
const app = express();
app.engine('html', require('ejs').renderFile);
const path = require('path');

app.get('/', (req, res, next)=> res.render(path.join(__dirname, 'index.html'), { user: {}}));

app.get('/login', (req, res)=> {
  res.redirect('https://github.com/login/oauth/authorize');
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));
