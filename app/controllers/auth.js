
var express = require('express'),
  router = express.Router();
var config = require('../../config/config');
var jwt = require('jsonwebtoken');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  config.auth.clientId,
  config.auth.clientSecret,
  config.host + ':' + config.port + config.auth.callbackURI
);

module.exports = function (app) {
  app.use(config.auth.callbackURI, router);
};


router.get('/', function (req, res, next) {
  var code = req.query.code;

  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.

    if (!err)
    {
      var jwtToken = jwt.sign({ tokens: tokens }, config.auth.jwtSecret, { issuer: 'http://lyonpri.de:' + config.port, expiresIn: 60 * 60 * 24}); // Expires in a day
      res.cookie('jwt', jwtToken);
      res.redirect('/');
    }
    else
    {
      console.log(err);
    }
  });
});