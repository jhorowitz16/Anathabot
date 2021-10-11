var assert = require('assert');
const bot = require('./bot.js');
const fixtures = require('./fixtures.js');
describe('Dice', function () {
    describe('#rollDice()', function () {
        it('should return a value between 1 and 6 inclusive', function () {
            die = bot.rollDice();
            assert(die <= 6 && bot.rollDice() >= 1)
        });
    });
});

describe('History', function () {
    describe('#getHistoryMessage()', function () {
        it('should return the correct history message based on placement and damage', function () {
            message = bot.getHistoryMessage(fixtures.MATCH_FIXTURE);
            assert.equal(
                message,
                'Last Game twitch.tv/anathana placed 4th place Kappa. He dealt 91 damage to players that game LUL LUL LUL'
            );
        });
    });
});
