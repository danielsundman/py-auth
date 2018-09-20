const requestPromise = require('request-promise-native');
const queryString = require('query-string');

const cfg = require('./settings_preprod_demo');

const getToken = async code => {
  // """ Returns a valid token with a code from user authentication
  //     (see https://developer.signicat.com/documentation/authentication/protocols/openid-connect/full-flow-example/)
  // """
  const body = queryString.stringify({
    'client_id': cfg.oidc['CLIENT_ID'],
    'redirect_uri': cfg.oidc['REDIRECT_URI'],
    'grant_type': 'authorization_code',
    code
  });

  const headers = {
    'Authorization': 'Basic ' + cfg.oidc['CRED64'],
    'content-type': 'application/x-www-form-urlencoded'
  };

  const options = {
    method: 'POST',
    uri: cfg.oidc['ISSUER_ID'] + 'token',
    headers,
    body,
    jar: true
  };

  try {
    const r = await requestPromise(options);
    const res = JSON.parse(r);
    return res.access_token;
  } catch (e) {
    return { error_description: e.message }
  }
};

const getUserInfo = async token => {
  // """ Returns JSON-formatted user info with a token from getToken
  //     (see https://developer.signicat.com/documentation/authentication/protocols/openid-connect/full-flow-example/)
  // """
  const auth_str = 'Bearer ' + token;
  const headers = {'Authorization': auth_str};
  const options = {
    uri: cfg.oidc['ISSUER_ID'] + 'userinfo',
    headers,
    jar: true
  };

  try {
    const r = await requestPromise(options);
    return JSON.parse(r);
  } catch (e) {
    return { error_description: e.message }
  }
};

module.exports = {
  getToken,
  getUserInfo
};
