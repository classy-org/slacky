var request = require('request');
var async = require('async');
var _ = require('lodash');
var config = require('../config');

module.exports.response = function(payload, arguments, slacky, callback) {

  var req = request.get('https://dev-gateway.classy-test.org/2.0/organization/34/activity', {
    'auth': {
      'bearer': config.classy_token
    },
    'strictSSL': false,
  }, function(error, response, body) {
    if (error) {
      var response = {
        text: 'Something went wrong'
      }
    }
    var result = JSON.parse(body);

    if (!result.error) {

      var totalCampaigns = {},
       campaignInfo = '*Most recent campaigns for NPO with CID 34*\n\n',
       campaignIndex = 0;

      for (var key in result.data) {
        var obj = result.data[key];

        if (campaignIndex < 5) {
          campaignInfo += ':triangular_flag_on_post: *Campaign Name:* ' + obj.campaign.name +
            '\n*Campaign ID:* ' + obj.campaign.id +
            '\n*Campaign Type:* ' + obj.type +
            '\n====================================\n';
        }

        campaignIndex++;
      }

      var response = {
        text: campaignInfo
      }
    } else {

      var response = {
          text: 'We couldn\'t find that organization\'s campaigns'
      }
    }
    callback(response);
  });
};
