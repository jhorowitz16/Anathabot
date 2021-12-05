console.log('https://developer.riotgames.com/ to regenerate key');
const tmi = require('tmi.js');
const fs = require('fs');
const https = require('https');
const request = require('request-promise');


let isRiotAvailable = false;
PUUID = 'BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw';
items = fs.readFileSync('items.json', 'utf8');
ITEMS = JSON.parse(items);


try {
    API_KEY = fs.readFileSync('key.txt', 'utf8');
    console.log(API_KEY);
    URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/anathana?api_key=${API_KEY}`;
    console.log(URL);
    https.get(URL, res => {
        res.on('data', d => {
            ladder = JSON.parse(d);
            console.log(ladder);
            isRiotAvailable = (!!ladder.id);
        });
        res.on('error', error => {
            isRiotAvailable = false;
        });

    });
} catch (err) {
    console.error(err)
}

// fetch the ladder sizes
let LADDER_LENGTHS = [0, 0, 0];
const ladders = ['master', 'grandmaster', 'challenger'];
const urls = ladders.map(lad => `https://na1.api.riotgames.com/tft/league/v1/${lad}?api_key=${API_KEY}`);
console.log(urls);
const promises = urls.map(url => request(url));
Promise.all(promises).then((data) => {
    LADDER_LENGTHS = data.map(ladderData => {
        const json = JSON.parse(ladderData);
        if (!json) {
            console.log('ladder error');
            return;
        }
        console.log(json.entries.length);
        return json.entries.length;
    })
});


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
            return '1st PogChamp';
        case 2:
            return '2th VoHiYo ';
        case 3:
            return '3rd TTours';
        case 4:
            return '4th Kappa';
        case 5:
            return '5th MrDestructoid';
        case 6:
            return '6th NotLikeThis';
        case 7:
            return '7th BibleThump BibleThump';
        case 8:
            return '8th BibleThump BibleThump BibleThump BibleThump';
    }

}

function bugString() {
    console.log(isRiotAvailable);
    if (!isRiotAvailable)
        return 'Spam HolidayTree this HolidayTree tree HolidayTree cuz HolidayTree invalid HolidayTree API HolidayTree key';
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
    return getHistoryMessageWithPUUID(matchData, PUUID);
}

function getHistoryMessageWithPUUID(matchData, puuid) {
    if (!matchData.info)
        return bugString();
    const fan = matchData.info.participants.find(p => p.puuid === puuid);
    if (!fan)
        return bugString();
    let comp = '';
    let carries = '';
    let itemStr = '';
    fan.units.forEach(unit => {
        name = unit.character_id.split('TFT6_')[1];
        tier = unit.tier
        comp += name + '_' + tier + ' ';
        if (unit.items.length === 3) {
            carries += name + ' ';

            function getName(id) {
                const item = ITEMS.find(x => x.id === id);
                return !item ? '' : item.name;
            }

            itemStr = ` (${unit.items.map(getName)})`;
        }
    });
    var match = `Last Game was a ${getPlacementString(fan.placement)}. `;
    match += `He dealt ${fan.total_damage_to_players} damage to players that game ${getDamageString(fan.total_damage_to_players)}. `;
    if (carries.includes('Malz'))
        match += 'He ran TwitchLit MALZ REROLL TwitchLit. ';
    if (carries.includes('Yone'))
        match += 'He ran TwitchLit CHALLENGER YONE TwitchLit. ';
    match += `He put 3 items on * ${carries}*${itemStr} with a final comp of ${comp}.`;
    return match;
}

function getLadderMessage(ladderData, ladder) {
    let arr = [];
    ladderData.entries.forEach(x => {
        arr.push([parseInt(x.leaguePoints), x.summonerName]);
    });
    arr.sort(function (a, b) {
        return a[0] - b[0];
    });
    // fan is the number of players in this ladder below anathana
    let fan = arr.findIndex(p => p[1] == 'anathana');
    ladderStr = ladder.charAt(0).toUpperCase() + ladder.slice(1);
    if (fan < 0)
        return `:( looks like twitch.tv/anathana isn't in the TFT ${ladderStr} (NA) ladder`;
    const fanLP = parseInt(fan.leaguePoints);
    LPs = arr.map(tup => tup[0]);
    percentile = Number((100 - (fan / arr.length * 100)).toFixed(2));
    if (fan < arr.length) {
        let report = `twitch.tv/anathana is in the top ${percentile}% of the ${arr.length} TFT ${ladderStr} Players (NA) at ${arr[fan][0]} LP. `;
        report += `there are ${LADDER_LENGTHS[2]} challenger players`;
        if (ladder === 'master')
            report += `and ${LADDER_LENGTHS[1]} GMs `;
        const base = LADDER_LENGTHS[2] + LADDER_LENGTHS[1] - fan;
        const rank = (ladder === 'master') ? base + LADDER_LENGTHS[0] : base;
        return `${report} above him. He's currently GivePLZ Rank #${rank} GivePLZ.`

    } else {
        bugString();
    }
}


RECENT_GAMES = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${PUUID}/ids?count=20&api_key=${API_KEY}`

function checkRiotAvailable(client, target) {
    console.log(`available ${isRiotAvailable}`);
    if (isRiotAvailable)
        return;
    client.say(
        target,
        'Spam HolidayTree this HolidayTree tree HolidayTree cuz HolidayTree invalid HolidayTree API HolidayTree key'
    );
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self || context['display-name'] === 'anathaBot') {
        return;
    } // Ignore messages from the bot

    const commandName = msg.trim();
    console.log(commandName);

    try {
        if (commandName === '!dice') {
            client.say(target, `You rolled a ${rollDice()}`);
        } else if (commandName === '!lobby') {
        } else if (commandName === '!history') {
            checkRiotAvailable(client, target);
            const req = https.get(RECENT_GAMES, res => {
                const req2 = res.on('data', d => {
                    history = JSON.parse(d);
                    const mostRecent = history[0];
                    MATCH_DATA = `https://americas.api.riotgames.com/tft/match/v1/matches/${mostRecent}?api_key=${API_KEY}`;
                    https.get(MATCH_DATA, res2 => {
                        let body = '';
                        res2.on('data', function (chunk) {
                            body += chunk; // string conversion
                        }).on('end', function () {
                            matchData = JSON.parse(body);
                            console.log(matchData);
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
            checkRiotAvailable(client, target);
            enemy = commandName.split('scout ')[1].replace(' ', '%20');
            URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${enemy}?api_key=${API_KEY}`;
            const req = https.get(URL, res => {
                res.on('data', d => {
                    const parsed = JSON.parse(d);
                    summonerID = parsed.id;
                    summonerPUUID = parsed.puuid;
                    if (!summonerID) {
                        client.say(target, bugString());
                        return;
                    }
                    MMR_URL = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}?api_key=${API_KEY}`;
                    const HISTORY_URL = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPUUID}/ids?count=20&api_key=${API_KEY}`

                    console.log(JSON.parse(d));

                    const urls = [MMR_URL, HISTORY_URL];
                    console.log(urls);
                    Promise.all(urls.map(url => request(url))).then((data) => {

                        const mmrData = JSON.parse(data[0])[0];
                        console.log(mmrData);
                        if (!mmrData || !mmrData.summonerName) {
                            client.say(target, `BibleThump ${commandName.split('scout ')[1]} hasn't played any ranked games this set FeelsBadMan BibleThump`);
                            return;
                        }
                        summoner = `${mmrData.summonerName} is currently ${mmrData.tier} ${mmrData.rank} ${mmrData.leaguePoints} LP.\n\n`;
                        winrate = Number((mmrData.wins / (mmrData.wins + mmrData.losses) * 100).toFixed(1));
                        summoner += `This set they have gotten first ${mmrData.wins} out of ${mmrData.wins + mmrData.losses} games (${winrate}%). `;

                        const mostRecent = JSON.parse(data[1].toString())[0];
                        MATCH_DATA = `https://americas.api.riotgames.com/tft/match/v1/matches/${mostRecent}?api_key=${API_KEY}`;
                        console.log(MATCH_DATA);
                        https.get(MATCH_DATA, res2 => {
                            let body = '';
                            res2.on('data', function (chunk) {
                                body += chunk; // string conversion
                            }).on('end', function () {
                                matchData = JSON.parse(body);
                                client.say(target, summoner + getHistoryMessageWithPUUID(matchData, summonerPUUID));
                            });
                            res2.on('error', error => console.error(error));
                        });
                    });
                });
            });
        } else if (commandName.includes('!MMR')) {
            checkRiotAvailable(client, target);
            URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/anathana?api_key=${API_KEY}`;
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
                    summoner += 'Follow his climb at https://lolchess.gg/profile/na/anathana :D';
                    client.say(target, summoner);
                });
            })
            req.on('error', error => {
                console.error(error)
            })
            req.end()
        } else if (commandName === '!help') {
            BOTS = 'MrDestructoid MrDestructoid MrDestructoid';
            const msg = `${BOTS} Possible Commands: !help, !history, !ladder, !rank, !scout SUMMONERNAME, and !MMR. Any questions lmk in chat ty ${BOTS}`;
            client.say(target, msg);
        } else if (commandName === '!ladder' || commandName === '!rank') {
            checkRiotAvailable(client, target);
            ladder = 'grandmaster';
            let LADDER_URL = `https://na1.api.riotgames.com/tft/league/v1/${ladder}?api_key=${API_KEY}`;
            https.get(LADDER_URL, res2 => {
                let body = '';
                res2.on('data', function (chunk) {
                    body += chunk; // string conversion
                }).on('end', function () {
                    const ladderData = JSON.parse(body);
                    console.log(ladderData.entries.length);
                    client.say(target, getLadderMessage(ladderData, ladder));
                });
                res2.on('error', error => {
                    console.error(error);
                })
            });
        } else {
            spam(target, msg);
        }

    } catch
        (error) {
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