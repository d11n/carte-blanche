/**
 * @file carte-blanche.js
 * Make it do.
 */


/**
 * @class Game
 * A game that can be played.
 */
var Game = Game || function (name) {
    'use strict';

    var setup = new Function;

    // game.name (read-only)
    Object.defineProperty(this, 'name', {
        enumerable: true,
        get: function () {
            return name;
        }
    });

    // game.setup (method)
    Object.defineProperty(this, 'setup', {
        enumerable: true,
        writeable: true,
        get: function () {
            return setup;
        },
        set: function (value) {
            if (value instanceof Function) {
                setup = value;
            } else {
                throw new Error('Game.setup must be Function');
            }
        }
    });
};


/**
 * @class Deck
 * A deck of things (usually cards) that are used by a game.
 */
var Deck = Deck || (function () {
    'use strict';

    var cardsRemaining = new String('Cards Remaining'),

        _Deck = function (name) {

            // deck.name (read-only)
            Object.defineProperty(this, 'name', {
                enumerable: true,
                get: function () {
                    return name;
                }
            });
        };

    Object.defineProperty(_Deck, 'cardsRemaining', {
        enumerable: true,
        get: function () {
            return cardsRemaining;
        }
    });

    return _Deck;
}());


/**
 * @class Device
 * A device running Carte Blanche.
 */
var Device = Device || function () {
    'use strict';

    this.screen = {};

    // device.screen.height (read-only)
    Object.defineProperty(this.screen, 'height', {
        enumerable: true,
        get: function () {
            return window.outerHeight;
        }
    });

    // device.screen.width (read-only)
    Object.defineProperty(this.screen, 'width', {
        enumerable: true,
        get: function () {
            return window.outerWidth;
        }
    });
};


/**
 * Set up the game environment and start playing!
 */
var Carteblanche = Carteblanche || (function () {
    'use strict';

    var CB = {},
        game,
        deck,
        device = new Device(),

        parseGamepieceDistroString = function (gamepieceDistro) {
            var _gamepieceDistro = {},
                groupSeparator = '\\/',
                groupEquator = '=',
                gamepieceSeparator = ',',
                groupRegex = new RegExp('([^' + groupSeparator + ']+((?=' + groupSeparator + ')|$))', 'g'),
                gamepieceRegex = new RegExp('(^.+(?=' + groupEquator + '))?([^=,]+)', 'g'),
                groupDistro;

            gamepieceDistro = gamepieceDistro.match(groupRegex);
            for (var i = gamepieceDistro.length; i--; ) {
                groupDistro = gamepieceDistro[i].match(gamepieceRegex);
                _gamepieceDistro[groupDistro.shift()] = groupDistro;
            }
            return _gamepieceDistro;
        },

        setup = function () {
            game
                && game.setup(device);
        },

        shuffle = function(deck) {
            if (deck instanceof Array) {
                deck = deck.sort(function(){return Math.random() < 0.5 ? -1 : 1});
            }
        };

    Object.defineProperty(CB, 'game', {
        enumerable: true,
        get: function () {
            return game;
        },
        set: function (value) {
            if (value instanceof Game) {
                game = value;
            } else {
                throw new Error("Carteblanche's game must be an instance of Game");
            }
        },
    });

    Object.defineProperty(CB, 'gamepieceDistro', {
        enumerable: true,
        get: function () {
            return parseGamepieceDistroString(window.location.hash.substr(1));
        },
    })

    Object.defineProperty(CB, 'shuffle', {
        enumerable: true,
        get: function () {
            return shuffle;
        },
    })

    document.addEventListener('DOMContentLoaded', setup);
    window.addEventListener('resize', setup);

    return CB;

}());
