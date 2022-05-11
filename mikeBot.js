API_KEY = 'RGAPI-15c268ea-0ae8-420b-a62e-8f525f5e7a9b';

const tmi = require('tmi.js');
const https = require('https')

// Define configuration options
const opts = {
    identity: {
        username: 'MikeYeungP1',
        password: 'oauth:sasi6bglezj08dzivyqtca7hg00jwp'
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

const seenUsers = new Set();

function onMessageHandler(target, context, msg, self) {
    console.log(self);
    if (self || context['display-name'] === 'MikeYeungP1' || context['display-name'] === 'anathaBot' || context['display-name'] === 'anathana') {
        return;
    } // Ignore messages from the bot

    const commandName = msg.trim();
    console.log(commandName);
    console.log(context);
    try {
        const name = context['display-name'];
        if (!seenUsers.has(name)) {

            if (name === 'strawbxrrie') {
                client.say(target, `Welcome to the stream ${name}! @anathana 6 cuties?`);
            } else if (name === 'WhiteFoxTFT') {
                client.say(target, `Welcome to the stream ${name}! ICANT ICANT`);
            } else if (name === 'trained_monkey') {
                client.say(target, `Welcome to the stream ${name}! monkaS`);
            } else if (name === 'snailman1234') {
                client.say(target, `Welcome to the stream ${name}! Hello Mr. Snail`);
            } else if (name === 'MyCatStoleMyLP') {
                client.say(target, `Welcome to the stream ${name}! u gotta greet him properly`);
            } else if (name === 'JustBuffer') {
                client.say(target, `Welcome to the stream ${name}! Remember to follow him at twitch.tv/JustBuffer`);
            } else if (name === 'a_stoiven') {
                client.say(target, `Welcome to the stream ${name}! @anathana yo yo how ur games`);
            } else {
                client.say(target, `Welcome to the stream ${name}! Thanks for stopping by!`);
            }
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
