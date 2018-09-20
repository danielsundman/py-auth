const express = require('express');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');

const cfg = require('./settings_preprod_demo');
const key = fs.readFileSync(cfg.CERT.key);
const cert = fs.readFileSync(cfg.CERT.crt);

const { getToken, getUserInfo } = require('./funcs');

const state = [...Array(20)].map(_ => (~~(Math.random() * 36)).toString(36)).join('');

const app = express();
app.use(cookieParser());
app.engine('ejs', require('ejs').renderFile);

const options = {
  key, cert
};

https.createServer(options, app).listen(443);

app.get('/', (req, res) => {
  const data = {
    background: 'darkolivegreen',
    url_oidc: cfg.URI_OIDC.replace('ZTATE', state),
    state
  };
  return res.render('intro.ejs', data);
});

const renderError = (res, err) => {
  const data = {
    background: 'darkred',
    err
  };
  return res.render('error.ejs', data);
};

app.get('/redirect', async (req, res) => {
  if (req.cookies && req.cookies.auth_state) {
    if (req.cookies.auth_state !== req.query.state) {
      return renderError(res, 'Wrong state!');
    }
  } else {
    return renderError(res, 'No state!');
  }
  if (req.query.error) {
    return renderError(res, req.query.error);
  }

  const { code } = req.query;
  const token = await getToken(code);
  const userInfo = await getUserInfo(token);

  const data = {
    background: 'skyblue',
    state,
    ...userInfo,
    national_id: userInfo['signicat.national_id'],
    method: 'node-OIDC'
  };
  return res.render('uinfo.ejs', data)
});
