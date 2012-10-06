
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
var editor = require('./routes/editor');

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

app.get('/config', function(req, res){
  var conf = JSON.parse(fs.readFileSync(__dirname + '/rkb.config.json').toString());
  res.header("Content-Type", "application/json");
  res.send(conf);
});

app.post('/config', function(req, res){
  fs.writeFileSync(__dirname + '/rkb.config.json', JSON.stringify(req.body));

  var conf = JSON.parse(fs.readFileSync(__dirname + '/rkb.config.json').toString());
  res.header("Content-Type", "application/json");
  res.send(conf);
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

