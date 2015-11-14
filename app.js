var logme = require('logme');
var express = require('express');

var config = require('./config');

process.on('uncaughtException', function(err) {
    debugger;
    logme.error('Caught Error ' + err);
    if (err.stack) {
        logme.error('Stack ' + err.stack);
    }
});

var app = express();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // simple logger
    app.use(function(req, res, next){
        logme.info(req.method + '  ' + req.url);
        next();
    });

    app.use(function(err, req, res, next){
        logme.error(err.stack);
        res.json({error:'Internal Server Error'},500);
        next();
    });

    app.use(app.router);

    require('./lib/routes/slash')(app);

    app.get('/', function(req, res, next) {
        res.send("it works!");
    });

});

// start the web application server
app.listen(config.port);

logme.info('Server running on port ' + config.port);

module.exports = app;
