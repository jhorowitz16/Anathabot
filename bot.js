console.log('https://developer.riotgames.com/ to regenerate key');
API_KEY = 'RGAPI-8e3e0845-23bd-42c7-b3dc-8c40b5756f59';

const tmi = require('tmi.js');
const https = require('https')

FAN_PUUID = 'BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw';
// Define configuration options
const opts = {
    identityOld: {
        username: 'MikeYeungP1',
        password: 'oauth:sasi6bglezj08dzivyqtca7hg00jwp'
    },
    identity: {
        username: 'anathaBot',
        password: 'oauth:g2w4jyxookcbbmjqp1dm7fduygywl0',
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


function spam(target, msg) {
    if (msg.toLowerCase().includes("squid")) {
        client.say(target, "GivePLZ GivePLZ GivePLZ GivePLZ GivePLZ");
    } else if (msg.toLowerCase().includes("pepe")) {
        client.say(target, `OSFrog OSFrog OSFrog OSFrog OSFrog`);
    } else if (msg.toLowerCase().includes("catjam")) {
        client.say(target, `${msg}? more like squidJAM Squid3 squidJAM`);
    } else if (msg.toLowerCase().includes("all his viewers are me")) {
        client.say(target, "I like that twitch.tv/anathana doesn't realize that all his viewers are me on different " +
            "accounts. Dont believe me? watch me post this on my other accounts");
    } else if (msg.toLowerCase().includes("slither")) {
        client.say(target, "ResidentSleeper ResidentSleeper ResidentSleeper ResidentSleeper ResidentSleeper");
    } else if (msg.toLowerCase().includes("draconic")) {
        client.say(target, "SMOrc SMOrc SMOrc SMOrc SMOrc");
    } else {
        if (hashCode(msg) % 10 > 2) {
            client.say(target, "Squid1 Squid2 Squid3 Squid4");
        }
    }
}

function getPlacementString(placement) {
    switch (placement) {
        case 1:
            return '1st place PogChamp';
        case 2:
            return '2th place VoHiYo ';
        case 3:
            return '3rd place TTours';
        case 4:
            return '4th place Kappa';
        case 5:
            return '5th place NotLikeThis';
        case 6:
            return '6th place NotLikeThis';
        case 7:
            return '7th place BibleThump BibleThump . _ .';
        case 8:
            return '8th place BibleThump BibleThump . __ .';
    }

}

function bugString() {
    return "Spam BrainSlug this BrainSlug slug BrainSlug cuz BrainSlug there's BrainSlug a BrainSlug bug";
}

function getDamageString(damage) {
    if (damage > 100) {
        return 'PogChamp PogChamp PogChamp';
    } else {
        return 'LUL LUL LUL';
    }
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot

    console.log(msg);
    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!history') {
        RECENT_GAMES = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw/ids?count=20&api_key=${API_KEY}`
        console.log(RECENT_GAMES);
        const req = https.get(RECENT_GAMES, res => {
            const req2 = res.on('data', d => {
                history = JSON.parse(d);
                console.log(history);
                const mostRecent = history[0];
                console.log(mostRecent);
                MATCH_DATA = `https://americas.api.riotgames.com/tft/match/v1/matches/${mostRecent}?api_key=${API_KEY}`
                console.log(MATCH_DATA);

                https.get(MATCH_DATA, res2 => {
                    let body = '';
                    res2.on('data', function (chunk) {
                        body += chunk; // string conversion
                    }).on('end', function () {
                        matchData = JSON.parse(body);
                        info = matchData.info;
                        participants = info.participants;
                        fan = participants.find(p => p.puuid == FAN_PUUID);
                        var match = `Last Game twitch.tv/anathana placed ${getPlacementString(fan.placement)}. `;

                        total_damage = fan.total_damage_to_players;
                        match += `He dealt ${total_damage} damage to players that game ${getDamageString(total_damage)}`;
                        client.say(target, match);
                    });
                    res2.on('error', error => {
                        console.error(error);
                    })
                });
            });
        });
        req.end()
    } else if (commandName.includes('!scout')) {
        console.log(commandName);
        enemy = commandName.split('scout ')[1];
        console.log(enemy);
        enemy = enemy.replace(' ', '%20');
        URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${enemy}?api_key=${API_KEY}`;
        console.log(URL);
        const req = https.get(URL, res => {
            res.on('data', d => {
                summonerID = JSON.parse(d).id;
                if (!summonerID) {
                    client.say(target, bugString());
                    return
                }
                MMR_URL = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}?api_key=${API_KEY}`;
                console.log(MMR_URL);
                const req2 = https.get(MMR_URL, res2 => {
                    res2.on('data', d => {
                        fan = JSON.parse(d.toString())[0];
                        console.log(fan);
                        if (!fan || !fan.summonerName) {
                            client.say(target, bugString());
                            return
                        }
                        summoner = `${fan.summonerName} is currently ${fan.tier} ${fan.rank} ${fan.leaguePoints} LP.\n\n`;
                        winrate = Number((fan.wins / (fan.wins + fan.losses) * 100).toFixed(1));
                        summoner += `This set they have gotten first ${fan.wins} out of ${fan.wins + fan.losses} games (${winrate}%). `;
                        client.say(target, summoner);
                    });
                })
            })
        });
    } else if (commandName === '!MMR') {
        URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/fanathema?api_key=${API_KEY}`;
        MMR_URL = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/g5gaMJ2p2a6CrirWqjdF1dsnqKyh0Se_R5Gc8GWiGc_Npms?api_key=${API_KEY}`;
        const req = https.get(MMR_URL, res => {
            res.on('data', d => {
                fan = JSON.parse(d.toString())[0];
                if (!fan) {
                    client.say(target, bugString());
                    return;
                }
                summoner = `${fan.summonerName} is currently ${fan.tier} ${fan.rank} ${fan.leaguePoints} LP.\n\n`;
                summoner += 'GivePLZ GivePLZ GivePLZ ';
                winrate = Number((fan.wins / (fan.wins + fan.losses) * 100).toFixed(1));
                summoner += `This set he has gotten first ${fan.wins} out of ${fan.wins + fan.losses} games (${winrate}%). `;
                summoner += 'GivePLZ GivePLZ GivePLZ ';
                summoner += 'Follow him at https://lolchess.gg/profile/na/fanathema';
                client.say(target, summoner);
            })
        })
        req.on('error', error => {
            console.error(error)
        })
        req.end()
    } else {
        spam(target, msg);
    }
}

// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}