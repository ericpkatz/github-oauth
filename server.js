const express = require('express');
const app = express();
app.engine('html', require('ejs').renderFile);
const path = require('path');
const query = require('query-string');
const request = require('request');

try{
  Object.assign(process.env, require('./env'));
}
catch(ex){
  console.log('no .env file.. must be production');
}

app.use((req, res, next)=> {
  res.locals.CLIENT_ID = process.env.CLIENT_ID;
  next();
});

const { CLIENT_ID, CLIENT_SECRET } = process.env;

app.get('/', (req, res, next)=> res.render(path.join(__dirname, 'index.html'), { user: {}}));

app.get('/login', (req, res)=> {
  const params = {
    client_id: CLIENT_ID
  };
  res.redirect(`https://github.com/login/oauth/authorize?${query.stringify(params)}`);
});

app.get('/callback', (req, res)=> {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: req.query.code
  };
  const url = `https://github.com/login/oauth/access_token?${query.stringify(params)}`;
  request.post(url, (err, result, body)=> {
    if(err){
      return next(err);
    }
    const accessToken = query.parse(body).access_token;
    const _params = {
      access_token: accessToken
    };
    const _url = `https://api.github.com/user`;
    const options = {
      url: _url,
      headers:{
        'User-Agent': 'request',
        'Authorization': `token ${accessToken}`
      }
    }
    request(options, (err, response, body)=>{
      if(err){
        return next(err); 
      }
      res.send(body);
    });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));
