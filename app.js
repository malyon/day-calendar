
var express = require('express'),
  config = require('./config/config'),
  logger = require('./config/log.js');

var app = express();

require('./config/express')(app, config);

console.log('Starting up on: ' + config.port);
app.listen(config.port);

