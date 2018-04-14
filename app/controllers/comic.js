var express = require('express'),
  router = express.Router();
var logger = require('winston');
var config = require('../../config/config');
var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment-timezone');

module.exports = function (app) {
  app.use('/comic', router);
};


// TODO: Get the auth token from the jwt and make the calls to get the events,
//  pass the events into the home route.
router.get('/', function (req, res, next) {
  var date = moment().tz('America/Chicago').format('YYYY/MM/DD');;
  logger.log('debug', 'Parsing html string for comic src');
  request('http://www.gocomics.com/peanuts/' + date, function(error, response, body) {
    if (error !== null)
    {
      res.status(500).json({error: 'There was a problem with the get request to gocomics.com'});
    }
    else
    {
      var htmlString = body;
      var $ = cheerio.load(htmlString);
      res.json({url: $('a[itemprop="image"] picture img').attr('src')})
    }
  });
});
