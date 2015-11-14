var request = require('request');
var async = require('async');
var config = require('../config');

module.exports.response = function(payload, arguments, slacky, callback) {
  var campaignresponse = {};

  var campaignId = arguments[0];

  request.get('https://dev-gateway.classy-test.org/2.0/campaign/' + campaignId, {
    'auth': {
      'bearer': config.classy_token
    },
    'strictSSL': false,
  }, function(error, response, body) {
    if (error) {
      campaignresponse = {
        text: 'Something went wrong'
      }
    }
    var result = JSON.parse(body);

    if (!result.error) {

          if (result.goal) {
            var goal = result.goal,
            formattedGoal = '$' + goal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          }

          var email = result.contact_email;
          var domain = email.substring(email.lastIndexOf("@") +1);

          campaignresponse = {
               //response_type: "in_channel",
              text: '*' + result.name + '*',
              attachments: [{
                color: '#439FE0',
                thumb_url: 'https://logo.clearbit.com/' + domain + '?size=64',
                fields: [
                      {
                        title: 'Organization ID',
                        value: result.organization_id,
                        short: true
                      },
                      {
                        title: 'Campaign Type',
                        value: result.type,
                        short: true
                      },
                      {
                        title: 'Campaign Goal',
                        value: formattedGoal,
                        short: true
                      },
                      {
                        title: 'Campaign ID',
                        value: result.id,
                        short: true
                      }
                  ]
              }]
          };

          request.get('https://dev-gateway.classy-test.org/2.0/campaign/51698/overview', {
            'auth': {
              'bearer': '8d2a2e288f7c4c57ccca0481928d1319'
            },
            'strictSSL': false,
          }, function(error, response, body) {
            if (error) {
              campaignresponse = {
                text: 'Something went wrong'
              }
            }
            //console.log(campaignresponse);

            var secondCall = JSON.parse(body);
            var fundraisers = {
              title: 'Donors count',
              value: secondCall.donors_count,
              short: true
            };
            var grossAmount = secondCall.total_gross_amount,
            formattedGross = '$' + grossAmount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var amount = {
              title: 'Total Gross Amount',
              value: formattedGross,
              short: true
            };

            campaignresponse.attachments[0].fields.push(fundraisers);
            campaignresponse.attachments[0].fields.push(amount);

            callback(campaignresponse);

          });
    } else {

      campaignresponse = {
          text: 'We couldn\'t find that campaign'
      }
    }
  });
};
