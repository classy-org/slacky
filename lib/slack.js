var request = require('request');
var logme = require('logme');

module.exports.factory = function(uri, name, icon) {
	return new Slack(uri, name, icon);
};

var Slack = function(uri, name, icon) {
    this.uri = uri;
    this.name = name || '',
    this.icon = icon || ''
};

Slack.prototype.sendMessage = function(message, channel, from, attachment, icon) {

	logme.debug('New message being sent to '+channel+'!');

	// setup the POST call to Slack's Incoming Webhook
	var params = {
	    uri: this.uri,
	    method: 'POST',
	    headers: {
		    'Content-Type': 'application/json'
	    }
	};

	var payload = {
		text : message,
		channel : (channel === '#directmessage') ? '@'+from : channel,
		username : this.name,
		icon_emoji : (!icon) ? this.icon : '',
		link_names : 1
	};

	if (attachment) {
		payload.attachments = attachment
	}

	params.body = JSON.stringify(payload);

    request(params, function(err, res, body) {
    	if (err) {
    		logme.error('Slack was unable to post the message: ');
    		logme.inspect(err);
		}
    });

};
