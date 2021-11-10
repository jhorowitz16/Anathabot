API_KEY = 'RGAPI-15c268ea-0ae8-420b-a62e-8f525f5e7a9b';

const tmi = require('tmi.js');
const https = require('https')

// Define configuration options
const opts = {
    identity: {
        username: 'jiaoziBot',
        password: 'oauth:m3ur3o0jou3km2rxiq3qg49ub3vmnw'
    },
    channels: [
        'anathana',
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

hashCode = s => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0)

const seenUsers = new Set();

function onMessageHandler(target, context, msg, self) {
    console.log(self);
    if (self || context['display-name'] === 'baozijiaozi') {
        return;
    } // Ignore messages from the bot

    const commandName = msg.trim();
    console.log(commandName);
    console.log(context);
    try {
        const name = context['display-name'];
        if (!seenUsers.has(name)) {
            client.say(target, `Welcome to the stream ${name}! Thanks for stopping by Squid3`);
        }
        seenUsers.add(context['display-name']);
    } catch (error) {
        console.log(error);
    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}


