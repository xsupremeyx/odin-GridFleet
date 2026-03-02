import { Gameboard } from './Gameboard.js';

export class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
        this.attemptedAttacks = new Set();
    }

    attack = (opponent, coordinate) => {
        return opponent.gameboard.receiveAttack(coordinate);
    };

    makeRandomAttack = (opponent) => {
        let attempts = 0;
        while (this.attemptedAttacks.size < 100 && attempts < 100) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            const coordinateKey = `${x},${y}`;
            if (this.attemptedAttacks.has(coordinateKey)) {
                attempts++;
                continue;
            }
            this.attemptedAttacks.add(coordinateKey);
            this.attack(opponent, [x, y]);
            break;
        }
    };
}
