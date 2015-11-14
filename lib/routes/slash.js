var logme = require('logme');

var Slacky = require('../slacky');

module.exports = function(app) {

	app.post('/slack',function(req, res, next) {
		if (req.body.user_name !== 'slackbot') {
			Slacky.slash(req.body, function(response) {
				if (typeof response == 'object') {
					res.json(response);
				} else {
					res.send(response);
				}
			});
		}
	});

};
