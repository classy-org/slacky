var events = require('events');
var logme = require('logme');
var _ = require('underscore');

var slack = require('./slack');
var config = require('../config');

function _Slacky() {

    this.slack = slack.factory(config.uri, config.name, config.icon);

    // registered Slash commands (it's friday the 13th...)
    this.slashers = {};

    this.post = function(message, channel, from, attachment) {
        this.slackbot.sendMessage(message, channel, from, attachment);
    };
}

_Slacky.prototype.slash = function(request, callback) {

    logme.info('Slash command received : ' + request.text);

    // Check that the request came from Slack
    if (config.token !== request.token ) {
        callback('None shall pass!');
    }

    var command = request.text.split(' ')[0].toLowerCase();
    logme.info('Slash command requested: ' + command);

    var handler = require('../commands/' + command);

    if (!handler) {
        logme.error('Command not found!: '+ command);

        callback("I was not able to find that command! :frowning:");
    } else {

        // Let's trap errors to keep them from bubbling up to Slack
        try {
            var arguments = request.text.split(" ").slice(1);

            handler.response(request, arguments, this, callback);
        } catch (err) {
            logme.error('Plugin Error on ' + command + '!');
            logme.error(err.name + ' - ' + err.message);

            callback('Aw man. Something terrible happened and I can\'t fullfil that request. :frowning:');
        }
    }
}

// Instantiate the singleton
var slacky = new _Slacky();
slacky.slashers = config.commands;

module.exports = slacky;
