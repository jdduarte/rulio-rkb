module.exports = exports = function(client) {
  var liveconf = require('liveconf');
  var fs = require('fs');
  
  precompiledRegexs = Object.create(null); //To create an object without prototype

  conf = liveconf(__dirname + '/rkb.config.json');

  updateConf();

  conf.ee.on('changed', updateConf);

  client.addListener('message', function (nick, to, text, message) {
     var match = getSomethingToSay(text, conf);
     if(match) {
      client.say(to, match);
     }
  });
};

function getSomethingToSay(text, conf){
  for(var e in conf){
    var keyword = conf[e];

    if(!precompiledRegexs[e]) {
      precompiledRegexs[e] = new RegExp(e);
    }

    if(precompiledRegexs[e].test(text) || text.toLowerCase().indexOf(e) != -1){
      var prob = Math.random();
      if(prob > keyword.prob){ return; }

      prob = Math.random();
      var totalProb = 0;

      for(var i = 0; i < keyword.options.length; ++i){
        totalProb += keyword.options[i].prob;
        if(totalProb > prob){
          //it's this one
          return keyword.options[i].text;
        }
      }
    }
  }
};

function randomFromInterval(from, to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
};

function updateConf(){
  for(var e in conf){
    var ceiling;
    if(!conf[e].prob){ 
      conf[e].prob = 1;
    }
    ceiling = conf[e].prob;

    normalizeConf(conf[e]);
  }

  for(k in precompiledRegexs) {
    if(!conf.hasOwnProperty(k)) {
      delete precompiledRegexs[k];
    }
  }
}


function normalizeConf(conf){
  var sumOfProbs = 0; var sumOfLackingProb = 0; var lackingProbProb = 0;

  //Sums up all the probs of a keyword and counts responses without prob
  for(var o in conf.options){
    var option = conf.options[o];
    if(option.prob){
      sumOfProbs += option.prob;
    } else {
      ++sumOfLackingProb;
    }
  }

  //divides remaining probs by the responses without prob
  if(sumOfProbs < 1){
    lackingProbProb = (1 - sumOfProbs)/sumOfLackingProb;

    for(var o in conf.options){
      var option = conf.options[o];
      if(!option.prob){
        option.prob = lackingProbProb;
      }
    }  
  //in case the sum of probs is larger than 1 it normalizes the probs
  } else {
    for(var o in conf.options){
      var option = conf.options[o];
      if(!option.prob){
        option.prob = 0;
      } else {
        option.prob = option.prob / sumOfProbs;
      }
    }  
  }
}

require('./app.js');