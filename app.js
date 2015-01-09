var irc = require('irc');
var http = require('http');
var wolf_client = require('node-wolfram');
var Wolfram = new wolf_client('A67UJA-VK7W8TPWU8');
var bot = new irc.Client('eu.ircnet.org', 'klerk', {
    debug: true,
    channels: ['#mokkascenes']
});

bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('message#blah', function(from, message) {
    console.log('<%s> %s', from, message);
});

bot.addListener('message', function(from, to, message) {
    console.log('%s => %s: %s', from, to, message);

    if (to.match(/^[#&]/)) {
        if (message.match(/^!wetter /)) {
		var split_msg = message.replace("!wetter","");
            http.get("http://api.openweathermap.org/data/2.5/weather?q="+split_msg, function(res) {
                var body = '';
		res.on('data', function(d) {
                    body += d;
                });
                res.on('end', function() {

                    var parsed = JSON.parse(body);

			if(parsed && parsed.weather && parsed.weather[0].main){
var temp = parseFloat(parsed.main.temp);
var temp_c = temp-273.15;
 bot.say(to, parsed.weather[0].description+", "+temp_c+"°C");
}
			else bot.say(to, "I dunno, soorrry :/");
		});
            });

        }
if (message.match(/^!wolfram /)) {
 var split_msg = message.replace("!wolfram","");
Wolfram.query(split_msg, function(err, result) {
    if(err)
         bot.say(to, err);
    else
    {
        for(var a=0; a<result.queryresult.pod.length; a++)
        {
            var pod = result.queryresult.pod[a];
             bot.say(to, pod.$.title,": ");
            for(var b=0; b<pod.subpod.length; b++)
            {
                var subpod = pod.subpod[b];
                for(var c=0; c<subpod.plaintext.length; c++)
                {
                    var text = subpod.plaintext[c];
                     bot.say(to, '\t'+text);
                }
            }
        }
    }
});

        }
        if (message.match(/hello/)) {
            bot.say(to, 'Hello there ' + from);
        }
        if (message.match(/dance/)) {
            setTimeout(function() {
                bot.say(to, '\u0001ACTION dances: :D\\-<\u0001');
            }, 1000);
            setTimeout(function() {
                bot.say(to, '\u0001ACTION dances: :D|-<\u0001');
            }, 2000);
            setTimeout(function() {
                bot.say(to, '\u0001ACTION dances: :D/-<\u0001');
            }, 3000);
            setTimeout(function() {
                bot.say(to, '\u0001ACTION dances: :D|-<\u0001');
            }, 4000);
        }
    } else {
        console.log('private message');
    }
});
bot.addListener('pm', function(nick, message) {
    console.log('Got private message from %s: %s', nick, message);
});
bot.addListener('join', function(channel, who) {
    console.log('%s has joined %s', who, channel);
});
bot.addListener('part', function(channel, who, reason) {
    console.log('%s has left %s: %s', who, channel, reason);
});
bot.addListener('kick', function(channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});
