var request = require('request');
var async = require('async');
var config = require('../config');

module.exports.response = function(payload, arguments, slacky, callback) {

  var search = arguments[0];

  request.get('https://dev-gateway.classy-test.org/2.0/organization-search/' + search, {
    'auth': {
      'bearer': config.classy_token
    },
    'strictSSL': false,
  }, function(error, response, body) {

    if (!error) {
      var result = JSON.parse(body);

      var org = result.data[0];

      var email = org.email_address;
      var domain = email.substring(email.lastIndexOf("@") +1);

      var response = {
          text: '*' + org.name + '*',
          attachments: [{
            color: '#439FE0',
            thumb_url: 'https://logo.clearbit.com/' + domain + '?size=64',
            fields: [
                  {
                    title: 'Organization ID',
                    value: org.id,
                    short: true
                  },
                  {
                    title: 'Admin Name',
                    value: org.contact_first_name + ' ' + org.contact_last_name,
                    short: true
                  },
                  {
                    title: 'Admin Email',
                    value: org.email_address,
                    short: true
                  },
                  {
                    title: 'EIN',
                    value: org.ein,
                    short: true
                  }
              ]
          }]
      };

      callback(response);

    } else {
        callback("I'm sorry, I was not able to find that Organization.  :frowning:");
    }

  });

};
