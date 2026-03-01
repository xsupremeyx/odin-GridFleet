import { Gameboard } from './Gameboard.js';
export class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
    }

    attack = (opponent, coordinate) => {
        opponent.gameboard.receiveAttack(coordinate);
    };

    makeRandomAttack = (opponent) => {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        this.attack(opponent, [x, y]);
    };
}
