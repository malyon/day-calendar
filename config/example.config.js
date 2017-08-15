var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'peanuts-day-calendar'
    },
    port: 3000,
    host: 'http://localhost',
    auth: {
      jwtSecret: 'JWT_SECRET',
      callbackURI: 'GOOGLE CALLBACK RELATIVE PATH',
      clientId: 'GOOGLE CLIENT ID',
      clientSecret: 'GOOGLE CLIENT SECRET'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'peanuts-day-calendar'
    },
    port: 3000,
    host: 'http://localhost',
    auth: {
      jwtSecret: 'JWT_SECRET',
      callbackURI: 'GOOGLE CALLBACK RELATIVE PATH',
      clientId: 'GOOGLE CLIENT ID',
      clientSecret: 'GOOGLE CLIENT SECRET'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'peanuts-day-calendar'
    },
    port: 80,
    host: 'http://localhost',
    auth: {
      jwtSecret: 'JWT_SECRET',
      callbackURI: 'GOOGLE CALLBACK RELATIVE PATH',
      clientId: 'GOOGLE CLIENT ID',
      clientSecret: 'GOOGLE CLIENT SECRET'
    }
  }
};

module.exports = config[env];
