/**
 * @file klondike.js
 * Set up the rules for Klondike solitaire.
 */

(function (CB) {
    'use strict';

    var klondike = new Game('Klondike'),
        gameEnvironmentColumns = 7,
        cardWidthRems = 6,
        gutterRems = 1,
        deck = [
            '♠︎.ace','♠︎.2','♠︎.3','♠︎.4','♠︎.5','♠︎.6','♠︎.7','♠︎.8','♠︎.9','♠︎.10','♠︎.jack','♠︎.queen','♠︎.king',
            '♥︎.ace','♥︎.2','♥︎.3','♥︎.4','♥︎.5','♥︎.6','♥︎.7','♥︎.8','♥︎.9','♥︎.10','♥︎.jack','♥︎.queen','♥︎.king',
            '♣︎.ace','♣︎.2','♣︎.3','♣︎.4','♣︎.5','♣︎.6','♣︎.7','♣︎.8','♣︎.9','♣︎.10','♣︎.jack','♣︎.queen','♣︎.king',
            '♦︎.ace','♦︎.2','♦︎.3','♦︎.4','♦︎.5','♦︎.6','♦︎.7','♦︎.8','♦︎.9','♦︎.10','♦︎.jack','♦︎.queen','♦︎.king',
        ],
        cardPiles = {
            'foundation-0': { deal: [] },
            'foundation-1': { deal: [] },
            'foundation-2': { deal: [] },
            'foundation-3': { deal: [] },
            'tableau-0': { deal: ['⍐'] },
            'tableau-1': { deal: ['⍗','⍐'] },
            'tableau-2': { deal: ['⍗','⍗','⍐'] },
            'tableau-3': { deal: ['⍗','⍗','⍗','⍐'] },
            'tableau-4': { deal: ['⍗','⍗','⍗','⍗','⍐'] },
            'tableau-5': { deal: ['⍗','⍗','⍗','⍗','⍗','⍐'] },
            'tableau-6': { deal: ['⍗','⍗','⍗','⍗','⍗','⍗','⍐'] },
            'draw-pile': { deal: Deck.cardsRemaining },
        };

    klondike.setup = function (device) {

        var url = '';

        // Set rem unit for CSS.
        document.documentElement.style.fontSize
            = (device.screen.width / (gameEnvironmentColumns * cardWidthRems
                + (gameEnvironmentColumns + 1) * gutterRems))
                + 'px';

        CB.shuffle(deck);

        for (var pile in cardPiles) {
            url += '/' + pile;
            pile = cardPiles[pile];
            pile.dealt = [];
            if (pile.deal === Deck.cardsRemaining) {
                pile.dealt = deck.map(function (card) { return card + '.' + '⍗'});
            } else {
                for (var i = 0, iExit = pile.deal.length; i < iExit; i++) {
                    pile.dealt.push(deck.shift() + '.' + pile.deal[i]);
                }
            }
            url += '=' + pile.dealt.join(',');
        }

        window.location.hash = url;

        this.deal();
    };

    klondike.deal = function () {

        var elementGame = document.getElementById('game'),
            elementPile,
            elementCard,
            gamepieceDistro,
            card;

        if (elementGame instanceof HTMLElement
            && (!elementGame.className
                || !elementGame.className.match(/\bdealt\b/))) {

            gamepieceDistro = CB.gamepieceDistro;
            for (var pile in gamepieceDistro) {
                if (elementPile = document.getElementById(pile)) {
                    pile = gamepieceDistro[pile];
                    for (var i = 0, iExit = pile.length; i < iExit; i++) {
                        card = pile[i].split('.');
                        elementCard = document.createElement('li');
                        elementCard.className = 'card';
                        elementCard.dataset.suit = card[0];
                        elementCard.dataset.rank = card[1];
                        elementCard.dataset.disposition = card[2];
                        elementPile.appendChild(elementCard);
                    }
                }
            }

            elementGame.className
                ? (elementGame.className += ' dealt')
                : (elementGame.className = 'dealt');
        }
    };

    CB.game = klondike;

}(Carteblanche));
