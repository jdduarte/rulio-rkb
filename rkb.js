module.exports = exports = function(client) {
  var liveconf = require('liveconf');
  var fs = require('fs');
  //var conf = JSON.parse(fs.readFileSync(__dirname + '/rkb.config.json').toString());
  conf = liveconf(__dirname + '/rkb.config.json');
  conf.ee.on('changed', function(){
    for(var e in conf){
      var ceiling;
      if(!e.prob){ 
        e.prob = 1;
      }
      ceiling = e.prob;

      normalizeConf(e);
    }
  });

  client.addListener('message', function (nick, to, text, message) {
     var match = getSomethingToSay(text, conf);
     if(match){
     	client.say(to, match);
     }
  });
};

function getSomethingToSay(text, conf){
  for(var e in conf){
    if(text.toLowerCase().indexOf(e) != -1){
      
      var prob = Math.random();
      if(e.prob > prob){ return; }

      prob = Math.random();
      var totalProb = 0;

      for(var i = 0; i < conf[e].length; ++i){
        totalProb += conf[e][i].prob;
        if(prob < totalProb){
          //it's this one
          return conf[e][i].text;
        }
      }
    }
  }
};

function randomFromInterval(from, to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
};

function normalizeConf(conf){
  var sumOfProbs = 0; var sumOfLackingProb = 0; var lackingProbProb = 0;

  for(var o in e.options){
    if(o.prob){
      sumOfProbs += o.prob;
    } else {
      ++sumOfLackingProb;
    }
  }

  if(sumOfProbs < 1){
    lackingProbProb = (1 - sumOfProbs)/sumOfLackingProb;

    for(var o in e.options){
      if(!o.prob){
        o.prob = lackingProbProb;
      }
    }  
  } else {
    for(var o in e.options){
      if(!o.prob){
        o.prob = 0;
      } else {
        o.prob = o.prob / sumOfProbs;
      }
    }  
  }
}
require('./app.js');