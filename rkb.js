module.exports = exports = function(client) {
  var liveconf = require('liveconf');
  var fs = require('fs');
  
  conf = liveconf(__dirname + '/rkb.config.json');
  precompiledRegexs = Object.create(null); //To create an object without prototype

  conf.ee.on('changed', function() {
    for(k in precompiledRegexs) {
      if(!conf.hasOwnProperty(k)) {
        delete precompiledRegexs[k];
      }
    }
  });

  client.addListener('message', function (nick, to, text, message) {
     var match = getSomethingToSay(text, conf);
     if(match) {
      client.say(to, match);
     }
  });
};

function getSomethingToSay(text, conf) {
  for(var e in conf) {
    if(!precompiledRegexs[e]) {
      precompiledRegexs[e] = new RegExp(e);
    }
    
    if(precompiledRegexs[e].test(text)) {
      var index = randomFromInterval(0, conf[e].length - 1);
      return conf[e][index];
    }
  }
};

function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
};

require('./app.js');