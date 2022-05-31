API_KEY = 'RGAPI-15c268ea-0ae8-420b-a62e-8f525f5e7a9b';

const tmi = require('tmi.js');
const http = require('http');
const HOME = "http://127.0.0.1:3000";
const customGreetings = new Map([
    ['strawbxrrie', '@anathana 6 cuties?'],
    ['WhiteFoxTFT', 'ICANT ICANT'],
    ['trained_monkey', 'monkaS'],
    ['snailman1234', 'Remember to follow him at twitch.tv/snailman1234'],
    ['MyCatStoleMyLP', 'u gotta greet him properly'],
    ['JustBuffer', 'Remember to follow him at twitch.tv/JustBuffer'],
    ['reunicoce', 'Remember to follow him at twitch.tv/reunicoce'],
    ['repose123', 'Ez game'],
    ['DrownedGod', 'Remember to follow him at twitch.tv/DrownedGod'],
    ['a_stoiven', '@anathana yo yo how ur games'],
    ['vanillaxd', '@anathana peepoHey'],
    ['linsins', 'Remember to follow hm at twitch.tv/linsins'],
    ['ChatPlaysLive', 'pog'],
])
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

function reportUserMessageData(target, username, callback) {
    console.log('fetching');
    console.log(`${HOME}/users/${username}`);
    http.get(`${HOME}/users/${username}`, res => {
        res.on('data', d => {
            client.say(target, callback(d.toString()));
        });
    });
}

function formatLeaderText(userDataStr) {
    const userData = JSON.parse(userDataStr);
    return `${userData.username} has ${userData.message_count} messages over ${userData.day_count} recent highlighted streams.`;
}

function onMessageHandler(target, context, msg, self) {
    console.log(msg);
    const commandName = msg.trim();
    const name = context['display-name'];
    if (commandName.includes('!user')) {
        const username = commandName.includes(' ') ? commandName.split('user ')[1] : name;
        reportUserMessageData(target, username, x => x)
    }

    if (self || context['display-name'] === 'MikeYeungP1' || context['display-name'] === 'anathaBot' || context['display-name'] === 'anathana') {
        return;
    } // Ignore messages from the bot

    console.log(commandName);
    console.log(context);

    try {
        if (!seenUsers.has(name)) {
            const greeting = customGreetings.get(name) || 'Thanks for stopping by.'
            reportUserMessageData(target, name, x => `Welcome to the stream @${name}! ${greeting} ${formatLeaderText(x)}`)
            seenUsers.add(context['display-name']);
        }
    } catch (error) {
        console.log(error);
    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
