console.log('https://developer.riotgames.com/ to regenerate key');
API_KEY = 'RGAPI-15c268ea-0ae8-420b-a62e-8f525f5e7a9b';

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
            return '5th place MrDestructoid';
        case 6:
            return '6th place NotLikeThis';
        case 7:
            return '7th place BibleThump BibleThump . _ .';
        case 8:
            return '8th place BibleThump BibleThump BibleThump BibleThump . __ .';
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

function getHistoryMessage(matchData) {
    const fan = matchData.info.participants.find(p => p.puuid == FAN_PUUID);
    var match = `Last Game twitch.tv/anathana placed ${getPlacementString(fan.placement)}. `;
    match += `He dealt ${fan.total_damage_to_players} damage to players that game ${getDamageString(fan.total_damage_to_players)}`;
    return match;
}

function getLadderMessage(ladderData) {

    let arr = [];
    console.log(ladderData.entries[0]);
    console.log(ladderData.entries[0].leaguePoints);
    ladderData.entries.forEach(x => {
        arr.push([Number(parseInt(x.leaguePoints)), x.summonerName]);
    });
    arr.sort();
    console.log(arr.length);
    console.log(arr[10000]);
    console.log(arr.toString());
    let fan = arr.findIndex(p => p[1] == 'fanathema');
    console.log(`original ${fan}`);
    console.log(fan.leaguePoints);
    const fanLP = parseInt(fan.leaguePoints);
    console.log(Number.isInteger(fanLP));
    console.log(Number.isInteger(4));
    LPs = arr.map(tup => tup[0]);
    percentile = Number((100 - (fan / arr.length * 100)).toFixed(3));
    return `twitch.tv/anathana is in the top ${percentile}% of the ${arr.length} TFT Masters Players (NA) at ${arr[fan][0]} LP.`;
}

RECENT_GAMES = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw/ids?count=20&api_key=${API_KEY}`

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot

    const commandName = msg.trim();
    console.log(commandName);

    try {
        if (commandName === '!dice') {
            client.say(target, `You rolled a ${rollDice()}`);
        } else if (commandName === '!history') {
            const req = https.get(RECENT_GAMES, res => {
                const req2 = res.on('data', d => {
                    history = JSON.parse(d);
                    const mostRecent = history[0];
                    MATCH_DATA = `https://americas.api.riotgames.com/tft/match/v1/matches/${mostRecent}?api_key=${API_KEY}`
                    https.get(MATCH_DATA, res2 => {
                        let body = '';
                        res2.on('data', function (chunk) {
                            body += chunk; // string conversion
                        }).on('end', function () {
                            matchData = JSON.parse(body);
                            // console.log(JSON.stringify(matchData, null, 4)); // print the response
                            client.say(target, getHistoryMessage(matchData));
                        });
                        res2.on('error', error => {
                            console.error(error);
                        })
                    });
                });
            });
            req.end()
        } else if (commandName.includes('!scout')) {
            enemy = commandName.split('scout ')[1].replace(' ', '%20');
            URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${enemy}?api_key=${API_KEY}`;
            const req = https.get(URL, res => {
                res.on('data', d => {
                    summonerID = JSON.parse(d).id;
                    if (!summonerID) {
                        client.say(target, bugString());
                        return
                    }
                    MMR_URL = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}?api_key=${API_KEY}`;
                    const req2 = https.get(MMR_URL, res2 => {
                        res2.on('data', d => {
                            fan = JSON.parse(d.toString())[0];
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
                    summoner += 'Follow his climb at https://lolchess.gg/profile/na/fanathema :D';
                    client.say(target, summoner);
                });
            })
            req.on('error', error => {
                console.error(error)
            })
            req.end()
        } else if (commandName === '!ladder') {
            LADDER_URL = `https://na1.api.riotgames.com/tft/league/v1/master?api_key=${API_KEY}`;
            https.get(LADDER_URL, res2 => {
                let body = '';
                res2.on('data', function (chunk) {
                    body += chunk; // string conversion
                }).on('end', function () {
                    const ladderData = JSON.parse(body);
                    client.say(target, getLadderMessage(ladderData));
                });
                res2.on('error', error => {
                    console.error(error);
                })
            });
        } else {
            spam(target, msg);
        }

    } catch (error) {
        console.log(error);
        client.say(target, bugString());
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

module.exports = {rollDice, getHistoryMessage, getLadderMessage}