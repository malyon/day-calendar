var express = require('express'),
  router = express.Router();
var config = require('../../config/config');
var moment = require('moment');


var google = require('googleapis'),
    jwt = require('jsonwebtoken'),
    Promise = require('promise');
var OAuth2 = google.auth.OAuth2;
var calendar = google.calendar('v3');

var oauth2Client = new OAuth2(
  config.auth.clientId,
  config.auth.clientSecret,
  config.host + ':' + config.port + config.auth.callbackURI
);

function getCalendarEvents(calendarId, auth)
{
  return new Promise(function (resolve, reject) {
    var startTime = new Date();
    startTime.setHours(0,0,0);
    var endTime = new Date(startTime.getTime());
    endTime.setDate(endTime.getDate() + 1);
    calendar.events.list({
      auth: auth,
      calendarId: encodeURIComponent(calendarId),
      // Change to the beginning of the day
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err)
      {
        console.log('Rejecting!!!!', err);
        console.log('calendarId: ', calendarId);
        return reject(err);
      }
      var events = response.items;
      return resolve(events);
    });
  });
}

function getCalendars(auth)
{
  return new Promise(function (resolve, reject) {
    calendar.calendarList.list({
      auth: auth
    }, function(err, response) {
      if (err)
      {
        return reject(err);
      }
      return resolve(response.items);
    });
  });
}

function getAllEvents(auth)
{
  return new Promise(function(resolve, reject) {
    getCalendars(auth).then(function (calendars) {
      var eventCalls = [];

      // get promise for each calendar event query
      for(var i = 0; i < calendars.length; i++)
      {
        eventCalls.push(getCalendarEvents(calendars[i].id, auth));
      }
      Promise.all(eventCalls).then(function(allCalendarEvents) {
        var combinedEvents = [];
        for (var i=0; i<allCalendarEvents.length; i++)
        {
          combinedEvents = combinedEvents.concat(allCalendarEvents[i]);
        }
        return resolve(combinedEvents);
      }, console.log);
    }, console.log);
  });
}


module.exports = function (app) {
  app.use('/', router);
};


// TODO: Get the auth token from the jwt and make the calls to get the events,
//  pass the events into the home route.
router.get('/', function (req, res, next) {
  try
  {
    var decode = jwt.verify(req.cookies.jwt, config.auth.jwtSecret);
    oauth2Client.setCredentials(decode.tokens);
  }
  catch(err)
  {
    console.log(err);
  }

  getAllEvents(oauth2Client).then(function(combinedEvents) {

     combinedEvents.sort(function (a, b) {
       if (a.start.dateTime == null)
       {
         return -1;
       }
       else if(b.start.dateTime == null)
       {
         return 1;
       }

       var dateA = moment(a.start.dateTime);
       var dateB = moment(b.start.dateTime);

       if(dateA.valueOf() < dateB.valueOf())
       {
         return -1;
       }
       else if (dateB.valueOf() < dateA.valueOf())
       {
         return 1;
       }
       return 0;
     });

     var events = [];

      for (var i=0; i<combinedEvents.length; i++)
      {
        var event = {};
        event.summary = combinedEvents[i].summary;

        if (combinedEvents[i].start.dateTime != null)
        {
          var format = 'h:mm A';
          var start = moment(combinedEvents[i].start.dateTime);
          var end = moment(combinedEvents[i].end.dateTime);

          event.timeStr = start.format('h:mm a') + ' - ' + end.format('h:mm a');
        }
        else
        {
          event.timeStr = 'All Day'
        }
        events.push(event);
      }
      var context = {};
      context.events = events;
      res.render('home.nks', context);
    }).catch(console.log);
});