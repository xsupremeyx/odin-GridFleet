import { Gameboard } from './Gameboard.js';

export class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
        this.attemptedAttacks = new Set();
        this.targetQueue = [];
    }

    attack = (opponent, coordinate) => {
        return opponent.gameboard.receiveAttack(coordinate);
    };

    enqueueAdjacent = (x, y) => {
        const directions = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
        ];

        // shuffle array
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        directions.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                this.targetQueue.push([nx, ny]);
            }
        });
    };

    makeRandomAttack = (opponent) => {
        while (this.targetQueue.length > 0) {
            const [x, y] = this.targetQueue.shift();
            const key = `${x},${y}`;

            if (!this.attemptedAttacks.has(key)) {
                this.attemptedAttacks.add(key);

                const outcome = this.attack(opponent, [x, y]);

                if (outcome.result === 'hit') {
                    if (outcome.sunk) {
                        this.targetQueue = [];
                    } else {
                        this.enqueueAdjacent(x, y);
                    }
                }

                return outcome;
            }
        }

        let attempts = 0;

        while (this.attemptedAttacks.size < 100 && attempts < 100) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            const key = `${x},${y}`;

            if (this.attemptedAttacks.has(key)) {
                attempts++;
                continue;
            }

            this.attemptedAttacks.add(key);

            const outcome = this.attack(opponent, [x, y]);

            if (outcome.result === 'hit') {
                if (outcome.sunk) {
                    this.targetQueue = [];
                } else {
                    this.enqueueAdjacent(x, y);
                }
            }

            return outcome;
        }
    };
}
