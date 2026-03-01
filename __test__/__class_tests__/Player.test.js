import { Player } from '../../src/classes/Player.js';
import { Gameboard } from '../../src/classes/Gameboard.js';
import { Ship } from '../../src/classes/Ship.js';

describe('Player class', () => {
    test('should initialize with correct properties', () => {
        const player = new Player('Player1');
        expect(player.type).toBe('Player1');
        expect(player.gameboard).toBeInstanceOf(Gameboard);
    });

    test("player can hit opponent's ship", () => {
        const player1 = new Player('Player1');
        const player2 = new Player('Player2');
        const ship = new Ship(3);
        player2.gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        player1.attack(player2, [0, 0]);
        expect(ship.hits).toBe(1);
    });
});
