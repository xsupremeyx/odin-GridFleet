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

    test('Computer player can make random attack', () => {
        const player1 = new Player('Player1');
        const player2 = new Player('Computer');
        const ship = new Ship(3);
        player1.gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        player2.makeRandomAttack(player1);
        if (ship.hits > 0) {
            expect(ship.hits).toBe(1);
        } else {
            expect(player1.gameboard.missedShots.length).toBe(1);
        }
    });

    test('Computer retries the attack if same coordinate is attempted to struck twice', () => {
        jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0);

        const player1 = new Player('Player1');
        const player2 = new Player('Computer');
        const ship = new Ship(3);
        player1.gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        player2.makeRandomAttack(player1);
        player2.makeRandomAttack(player1);
        expect(ship.hits + player1.gameboard.missedShots.length).toBe(2);
        expect(player2.attemptedAttacks.size).toBe(2);
        Math.random.mockRestore();
    });
});
