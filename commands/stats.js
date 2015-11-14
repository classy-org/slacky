var request = require('request');
var config = require('../config');

module.exports.response = function(payload, arguments, slacky, callback) {

  var req = request.get('https://dev-gateway.classy-test.org/2.0/organization/' + arguments + '/activity', {
    'auth': {
      'bearer': config.classy_token
    },
    'strictSSL': false,
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    console.log(body);
  });
};
