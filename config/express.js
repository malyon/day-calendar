var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var nunjucks = require('nunjucks');
var jwt = require('jsonwebtoken');
var https = require('https');
var config = require('./config');
var logger = require('winston');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  config.auth.clientId,
  config.auth.clientSecret,
  config.host + ':' + config.port + config.auth.callbackURI
);
var scope = 'https://www.googleapis.com/auth/calendar';
var googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scope
});

module.exports = function(app, config) {
  //Configure nunjucks
  nunjucks.configure('app/views', {
    autoescape: true,
    express: app
  });

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(favicon(config.root + '/public/images/favicon.ico'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));

  // Middleware for rerouting requests if google auth token not valid.
  app.use(function (req, res, next) {

    if(req._parsedUrl.pathname === '/auth/google/callback')
    {
      next();
    }
    else
    {
      var token = req.cookies.jwt;
      jwt.verify(token, config.auth.jwtSecret, function(err, decoded) {
        if (!err)
        {

          var req = https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + decoded.tokens['access_token'], function(httpsRes) {
            var responseStr = '';
            httpsRes.on('data', function(d) {
              process.stdout.write(d);
              responseStr += d;
            });
            httpsRes.on('end', function() {
              var responseObj = JSON.parse(responseStr);
              if (responseObj.expires_in != null)
              {
                next();
              }
              else
              {
                res.redirect(googleAuthUrl);
              }
            });
            httpsRes.on('error', function(err) {
              logger.log('error', err);
            });
          });
        }
        else
        {
          logger.log('debug', 'Redirecting to ' + googleAuthUrl);
          res.redirect(googleAuthUrl);
        }
      });
    }
  });

  var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });
};
