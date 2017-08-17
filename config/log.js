var logger = require('winston');
var config = require('./config');

logger.level='error';
logFile = config.root + '/peants_calendar.log';
logger.add(logger.transports.File, {filename: logFile});
logger.log('info', 'Logging initialized!');
logger.remove(logger.transports.Console);
module.exports=logger;