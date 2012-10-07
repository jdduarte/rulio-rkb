
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
var editor = require('./routes/editor');
var path = require('path');
var exists = fs.existsSync || path.existsSync ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

var configFile = __dirname + '/rkb.config.json';

if (!exists(configFile)) {
  fs.writeFileSync(configFile, fs.readFileSync(configFile + '.example'));
}

app.get('/config', function(req, res){
  fs.readFile(configFile, function(err, data) {
    if (err) {
      res.send(500);
      console.error(err);
      return;
    }

    var conf = JSON.parse(data.toString());
    res.header("Content-Type", "application/json");
    res.send(conf);
  });
});

app.post('/config', function(req, res){
  fs.writeFile(configFile, JSON.stringify(req.body, undefined, 2), function(err) {
    if (err) {
      res.send(500);
      console.error(err);
      return;
    }

    fs.readFile(configFile, function(err, data) {
      if (err) {
        res.send(500);
        console.error(err);
        return;
      }

      var conf = JSON.parse(data.toString());
      res.header("Content-Type", "application/json");
      res.send(conf);
    });
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

