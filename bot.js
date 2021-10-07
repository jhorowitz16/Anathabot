console.log('https://developer.riotgames.com/ to regenerate key');
API_KEY = 'RGAPI-f6ce64c6-6104-4542-bf64-aa0c5d5ed606';

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
    } else if (msg.toLowerCase().includes("draconic")) {
        client.say(target, "BagOfMemes BagOfMemes BagOfMemes BagOfMemes BagOfMemes ");
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
            return '5th place BibleThump BibleThump FeelsBadMan';
        case 6:
            return '6th place BibleThump BibleThump FeelsBadMan';
        case 7:
            return '7th place BibleThump BibleThump FeelsBadMan';
        case 8:
            return '8th place BibleThump BibleThump FeelsBadMan';
    }

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
        URL = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${enemy}?api_key=${API_KEY}`;
        console.log(URL);
        const req = https.get(URL, res => {
            res.on('data', d => {
                d = JSON.parse(d);
                console.log(d);
                summonerID = d.id;
                MMR_URL = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}?api_key=${API_KEY}`;
                console.log(MMR_URL);
                const req2 = https.get(MMR_URL, res2 => {
                    res2.on('data', d => {
                        d = JSON.parse(d.toString());
                        console.log(d);
                        fan = d[0];
                        console.log(fan);
                        summoner = `${fan.summonerName} is currently ${fan.tier} ${fan.rank} ${fan.leaguePoints} LP.\n\n`;
                        winrate = Number((fan.wins / (fan.wins + fan.losses) * 100).toFixed(1));
                        summoner += `This set he has gotten first ${fan.wins} out of ${fan.wins + fan.losses} games (${winrate}%). `;
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
                d = JSON.parse(d.toString());
                fan = d[0];
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


riot = '${API_KEY}'

temp = {
    "id": "g5gaMJ2p2a6CrirWqjdF1dsnqKyh0Se_R5Gc8GWiGc_Npms",
    "accountId": "A-buldZ0gSitz6AgtD0Gso6NrspGeQ0Oylry-jSydTvb5u0",
    "puuid": "BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw",
    "name": "fanathema",
    "profileIconId": 4780,
    "revisionDate": 1633413111115,
    "summonerLevel": 159
}
console.log(`${temp.name} is summoner level ${temp.summonerLevel} checkout https://na.op.gg/summoner/userName=fanathema`);

// encrypted summoner id g5gaMJ2p2a6CrirWqjdF1dsnqKyh0Se_R5Gc8GWiGc_Npms
/*
[
    {
        "leagueId": "7df89940-f4d6-3156-8e3c-b77a1edd30c6",
        "queueType": "RANKED_TFT",
        "tier": "MASTER",
        "rank": "I",
        "summonerId": "g5gaMJ2p2a6CrirWqjdF1dsnqKyh0Se_R5Gc8GWiGc_Npms",
        "summonerName": "fanathema",
        "leaguePoints": 285,
        "wins": 56,
        "losses": 227,
        "veteran": false,
        "inactive": false,
        "freshBlood": false,
        "hotStreak": false
    }
]


[
    "NA1_4062139383",
    "NA1_4062154924",
    "NA1_4062142359",
    "NA1_4062049406",
    "NA1_4062082746",
    "NA1_4061380159",
    "NA1_4061288261",
    "NA1_4061322012",
    "NA1_4061257600",
    "NA1_4061245051",
    "NA1_4059973377",
    "NA1_4059917023",
    "NA1_4059854434",
    "NA1_4059850929",
    "NA1_4059245610",
    "NA1_4059077374",
    "NA1_4058372607",
    "NA1_4058360757",
    "NA1_4058305733",
    "NA1_4058076126"
]


{
    "metadata": {
        "data_version": "5",
        "match_id": "NA1_4062139383",
        "participants": [
            "BEm9L_M1dnMWeL1bhnjcygBeq52Un8XQJrIazsEwWZ1PpBYGFABE2LoDwgGFCH-o1D9NMdyGIqVh3Q",
            "GwNqimHFtQx_4t2sYqi2-XWuVszEL13TQCsxXXc-Wt_5MwUVMHErW6D4KSdse8l4YjFDxb2dKVcXxQ",
            "VqQXVT5YJD8mapWGVSC3tUlX49FjDXwmNz-ZMSkld1AkET_t7Xx_IUgma6v_CAIvO_LG-bcrO7UJjQ",
            "ZYn_JLwq6zQwmNQzvMr7s5CaKNdvTLFu7zk5kJ269kqUVa_QB_2J_U44wUC0sEDiiNIg1VJUR9V8Vg",
            "BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw",
            "ZvrFETp6iarjlWSatIFfwqDATkIQMHJTf1q2IUMvDcKHUmcXFRfuH2kDV-Jxu5y2PY1Z275BvUPWwg",
            "0tZ8P-gB7uOyH0fDY5a3Z9lsj8CcBXjIxmI_TF8pKK3eGa2CIN0NIccb8STCJTkrd2vY_DEPliz9cg",
            "FQUJtOKsufrb5FzFiqujmUiBORfNAwGhm7f7XkbSi9btGAsFpR45pzHtG02Ki1PdvElTO9tprUZnnA"
        ]
    },
    "info": {
        "game_datetime": 1633417103004,
        "game_length": 2064.0498046875,
        "game_version": "Version 11.19.398.9466 (Sep 21 2021/21:57:40) [PUBLIC] ",
        "participants": [
            {
                "companion": {
                    "content_ID": "d847608a-1917-4efa-9269-e28317cd09fb",
                    "skin_ID": 22,
                    "species": "PetChoncc"
                },
                "gold_left": 1,
                "last_round": 37,
                "level": 8,
                "placement": 2,
                "players_eliminated": 0,
                "puuid": "BEm9L_M1dnMWeL1bhnjcygBeq52Un8XQJrIazsEwWZ1PpBYGFABE2LoDwgGFCH-o1D9NMdyGIqVh3Q",
                "time_eliminated": 2055.7666015625,
                "total_damage_to_players": 135,
                "traits": [
                    {
                        "name": "Set5_Cavalier",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Dawnbringer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Forgotten",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Ironclad",
                        "num_units": 3,
                        "style": 3,
                        "tier_current": 2,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 4,
                        "style": 2,
                        "tier_current": 2,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Legionnaire",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Redeemed",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 3,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Skirmisher",
                        "num_units": 3,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Victorious",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Olaf",
                        "items": [],
                        "name": "",
                        "rarity": 0,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Nautilus",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Thresh",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Irelia",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Jax",
                        "items": [
                            2049,
                            26,
                            19
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Rell",
                        "items": [
                            55
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Galio",
                        "items": [
                            45,
                            56,
                            78
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Garen",
                        "items": [
                            37,
                            36,
                            47
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 2
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "d401983f-04c9-4809-a1f4-d995a9ab6091",
                    "skin_ID": 18,
                    "species": "PetFenroar"
                },
                "gold_left": 0,
                "last_round": 35,
                "level": 8,
                "placement": 3,
                "players_eliminated": 0,
                "puuid": "GwNqimHFtQx_4t2sYqi2-XWuVszEL13TQCsxXXc-Wt_5MwUVMHErW6D4KSdse8l4YjFDxb2dKVcXxQ",
                "time_eliminated": 1966.513427734375,
                "total_damage_to_players": 126,
                "traits": [
                    {
                        "name": "Set5_Abomination",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Assassin",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Cruel",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Hellion",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Invoker",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Mystic",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Nightbringer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Ranger",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Redeemed",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Renewer",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Revenant",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Varus",
                        "items": [
                            67
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Lulu",
                        "items": [
                            17
                        ],
                        "name": "",
                        "rarity": 2,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Diana",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Galio",
                        "items": [
                            77,
                            36,
                            55
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Ivern",
                        "items": [],
                        "name": "Ivern",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Aphelios",
                        "items": [
                            2049,
                            23,
                            12
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Fiddlesticks",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Teemo",
                        "items": [
                            44,
                            12
                        ],
                        "name": "",
                        "rarity": 5,
                        "tier": 1
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "9b45f80f-16f2-495d-a39d-1ca07adde4a8",
                    "skin_ID": 27,
                    "species": "PetDSSquid"
                },
                "gold_left": 0,
                "last_round": 31,
                "level": 7,
                "placement": 6,
                "players_eliminated": 0,
                "puuid": "VqQXVT5YJD8mapWGVSC3tUlX49FjDXwmNz-ZMSkld1AkET_t7Xx_IUgma6v_CAIvO_LG-bcrO7UJjQ",
                "time_eliminated": 1735.93798828125,
                "total_damage_to_players": 68,
                "traits": [
                    {
                        "name": "Set5_Cavalier",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Cruel",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    },
                    {
                        "name": "Set5_Hellion",
                        "num_units": 6,
                        "style": 3,
                        "tier_current": 3,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Invoker",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Ironclad",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Mystic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Redeemed",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Skirmisher",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Spellweaver",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Kled",
                        "items": [
                            19,
                            11,
                            2016
                        ],
                        "name": "",
                        "rarity": 0,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Poppy",
                        "items": [
                            7
                        ],
                        "name": "",
                        "rarity": 0,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Ziggs",
                        "items": [
                            67
                        ],
                        "name": "",
                        "rarity": 0,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Kennen",
                        "items": [
                            37,
                            45
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Lulu",
                        "items": [],
                        "name": "",
                        "rarity": 2,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Rell",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Teemo",
                        "items": [
                            15,
                            39,
                            14
                        ],
                        "name": "",
                        "rarity": 5,
                        "tier": 1
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "f47232a0-6a07-4f18-9eda-eba4ee06a6e7",
                    "skin_ID": 18,
                    "species": "PetSGCat"
                },
                "gold_left": 25,
                "last_round": 27,
                "level": 7,
                "placement": 7,
                "players_eliminated": 0,
                "puuid": "ZYn_JLwq6zQwmNQzvMr7s5CaKNdvTLFu7zk5kJ269kqUVa_QB_2J_U44wUC0sEDiiNIg1VJUR9V8Vg",
                "time_eliminated": 1501.0672607421875,
                "total_damage_to_players": 52,
                "traits": [
                    {
                        "name": "Set5_Cannoneer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Ironclad",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Legionnaire",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Ranger",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Renewer",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 6,
                        "style": 3,
                        "tier_current": 2,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Skirmisher",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Senna",
                        "items": [],
                        "name": "",
                        "rarity": 0,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Nautilus",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Irelia",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Rakan",
                        "items": [],
                        "name": "",
                        "rarity": 2,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Lucian",
                        "items": [
                            19,
                            39,
                            2011
                        ],
                        "name": "Lucian",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Galio",
                        "items": [
                            56,
                            36,
                            45
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Akshan",
                        "items": [
                            23,
                            69,
                            11
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 1
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "ffba61ec-6952-405e-8854-b609f637c28d",
                    "skin_ID": 4,
                    "species": "PetDSWhale"
                },
                "gold_left": 0,
                "last_round": 26,
                "level": 8,
                "placement": 8,
                "players_eliminated": 0,
                "puuid": "BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw",
                "time_eliminated": 1427.4766845703125,
                "total_damage_to_players": 46,
                "traits": [
                    {
                        "name": "Set5_Abomination",
                        "num_units": 2,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Brawler",
                        "num_units": 4,
                        "style": 3,
                        "tier_current": 2,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Caretaker",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 2,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Hellion",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Mystic",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Nightbringer",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Ranger",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Renewer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Revenant",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Sett",
                        "items": [
                            48
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Lulu",
                        "items": [],
                        "name": "",
                        "rarity": 2,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Nunu",
                        "items": [
                            99,
                            77,
                            19
                        ],
                        "name": "",
                        "rarity": 2,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Aphelios",
                        "items": [
                            2049,
                            23,
                            11
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Fiddlesticks",
                        "items": [
                            55,
                            1193,
                            57
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Heimerdinger",
                        "items": [],
                        "name": "",
                        "rarity": 4,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Akshan",
                        "items": [],
                        "name": "",
                        "rarity": 4,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Volibear",
                        "items": [
                            67
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 1
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "5ac837f5-1979-4b56-99bc-cef04547d067",
                    "skin_ID": 19,
                    "species": "PetUmbra"
                },
                "gold_left": 18,
                "last_round": 34,
                "level": 7,
                "placement": 4,
                "players_eliminated": 0,
                "puuid": "ZvrFETp6iarjlWSatIFfwqDATkIQMHJTf1q2IUMvDcKHUmcXFRfuH2kDV-Jxu5y2PY1Z275BvUPWwg",
                "time_eliminated": 1907.720458984375,
                "total_damage_to_players": 94,
                "traits": [
                    {
                        "name": "Set5_Assassin",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Brawler",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Cavalier",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Ironclad",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Legionnaire",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Nightbringer",
                        "num_units": 4,
                        "style": 2,
                        "tier_current": 2,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Redeemed",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Skirmisher",
                        "num_units": 3,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Sejuani",
                        "items": [
                            66,
                            36
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Irelia",
                        "items": [
                            79,
                            17,
                            17
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_LeeSin",
                        "items": [],
                        "name": "",
                        "rarity": 2,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Yasuo",
                        "items": [
                            2039,
                            34,
                            26
                        ],
                        "name": "",
                        "rarity": 2,
                        "tier": 3
                    },
                    {
                        "character_id": "TFT5_Jax",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Rell",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Diana",
                        "items": [
                            14,
                            12
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "5ac837f5-1979-4b56-99bc-cef04547d067",
                    "skin_ID": 19,
                    "species": "PetUmbra"
                },
                "gold_left": 4,
                "last_round": 33,
                "level": 8,
                "placement": 5,
                "players_eliminated": 0,
                "puuid": "0tZ8P-gB7uOyH0fDY5a3Z9lsj8CcBXjIxmI_TF8pKK3eGa2CIN0NIccb8STCJTkrd2vY_DEPliz9cg",
                "time_eliminated": 1833.9403076171875,
                "total_damage_to_players": 113,
                "traits": [
                    {
                        "name": "Set5_Assassin",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Brawler",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Cannoneer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Invoker",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Ranger",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Renewer",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Revenant",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 6,
                        "style": 3,
                        "tier_current": 2,
                        "tier_total": 3
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Senna",
                        "items": [],
                        "name": "",
                        "rarity": 0,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Pyke",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Rakan",
                        "items": [
                            39
                        ],
                        "name": "",
                        "rarity": 2,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Lucian",
                        "items": [
                            11,
                            49,
                            25
                        ],
                        "name": "Lucian",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Galio",
                        "items": [
                            6
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Ivern",
                        "items": [
                            79,
                            79
                        ],
                        "name": "Ivern",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Akshan",
                        "items": [
                            29
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Volibear",
                        "items": [
                            45,
                            56,
                            2055
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 2
                    }
                ]
            },
            {
                "companion": {
                    "content_ID": "2e24117d-eb2f-4eb7-875b-660c7ca682a3",
                    "skin_ID": 37,
                    "species": "PetPenguKnight"
                },
                "gold_left": 2,
                "last_round": 37,
                "level": 9,
                "placement": 1,
                "players_eliminated": 5,
                "puuid": "FQUJtOKsufrb5FzFiqujmUiBORfNAwGhm7f7XkbSi9btGAsFpR45pzHtG02Ki1PdvElTO9tprUZnnA",
                "time_eliminated": 2055.7666015625,
                "total_damage_to_players": 163,
                "traits": [
                    {
                        "name": "Set5_Cavalier",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Dawnbringer",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Draconic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Forgotten",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Inanimate",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    },
                    {
                        "name": "Set5_Invoker",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 2
                    },
                    {
                        "name": "Set5_Ironclad",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Knight",
                        "num_units": 4,
                        "style": 2,
                        "tier_current": 2,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Mystic",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Ranger",
                        "num_units": 2,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Redeemed",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Renewer",
                        "num_units": 3,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Revenant",
                        "num_units": 1,
                        "style": 0,
                        "tier_current": 0,
                        "tier_total": 4
                    },
                    {
                        "name": "Set5_Sentinel",
                        "num_units": 3,
                        "style": 1,
                        "tier_current": 1,
                        "tier_total": 3
                    },
                    {
                        "name": "Set5_Victorious",
                        "num_units": 1,
                        "style": 3,
                        "tier_current": 1,
                        "tier_total": 1
                    }
                ],
                "units": [
                    {
                        "character_id": "TFT5_Nautilus",
                        "items": [
                            56,
                            55,
                            37
                        ],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Thresh",
                        "items": [],
                        "name": "",
                        "rarity": 1,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Rakan",
                        "items": [],
                        "name": "",
                        "rarity": 2,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Rell",
                        "items": [
                            55,
                            77
                        ],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Galio",
                        "items": [],
                        "name": "",
                        "rarity": 3,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Ivern",
                        "items": [],
                        "name": "Ivern",
                        "rarity": 3,
                        "tier": 1
                    },
                    {
                        "character_id": "TFT5_Gwen",
                        "items": [
                            25,
                            1190
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Garen",
                        "items": [
                            48
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 2
                    },
                    {
                        "character_id": "TFT5_Akshan",
                        "items": [
                            49,
                            12,
                            2026
                        ],
                        "name": "",
                        "rarity": 4,
                        "tier": 2
                    }
                ]
            }
        ],
        "queue_id": 1100,
        "tft_game_type": "standard",
        "tft_set_number": 5
    }
}
 */