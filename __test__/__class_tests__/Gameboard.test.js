import { Gameboard } from '../../src/classes/Gameboard.js';
import { Ship } from '../../src/classes/Ship.js';

// make a gameboard class before each test
let gameboard;
beforeEach(() => {
    gameboard = new Gameboard();
});

describe('Gameboard class tests', () => {
    test('Class should exist', () => {
        expect(gameboard).toBeInstanceOf(Gameboard);
    });
    test('Stores Ships', () => {
        expect(gameboard.ships).toBeDefined();
        expect(Array.isArray(gameboard.ships)).toBe(true);
        expect(gameboard.ships.length).toBe(0);
    });
    test('Places a ship and stores it in the ships array', () => {
        const ship = new Ship(3);
        gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        expect(gameboard.ships.length).toBe(1);
        expect(gameboard.ships[0].coordinates).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        expect(gameboard.ships[0].ship).toBe(ship);
    });
    test('Receives a fired shot as a miss', () => {
        gameboard.receiveAttack([5, 5]);
        expect(gameboard.ships.length).toBe(0);
        expect(gameboard.missedShots.length).toBe(1);
        expect(gameboard.missedShots[0]).toEqual([5, 5]);
    });
    test('Receives a fired shot as a hit', () => {
        const ship = new Ship(3);
        gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        gameboard.receiveAttack([0, 1]);
        expect(gameboard.ships[0].ship.hits).toBe(1);
        expect(gameboard.missedShots.length).toBe(0);
    });
    test('areAllShipsSunk returns False if atleast one ship is not sunk', () => {
        const ship1 = new Ship(3);
        const ship2 = new Ship(2);
        gameboard.placeShip(ship1, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        gameboard.placeShip(ship2, [
            [1, 0],
            [1, 1],
        ]);
        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([0, 1]);
        gameboard.receiveAttack([0, 2]);
        gameboard.receiveAttack([1, 0]);
        expect(gameboard.areAllShipsSunk()).toBe(false);
    });
    test('areAllShipsSunk returns True if all ships are sunk', () => {
        const ship1 = new Ship(3);
        const ship2 = new Ship(2);
        gameboard.placeShip(ship1, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        gameboard.placeShip(ship2, [
            [1, 0],
            [1, 1],
        ]);
        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([0, 1]);
        gameboard.receiveAttack([0, 2]);
        gameboard.receiveAttack([1, 0]);
        gameboard.receiveAttack([1, 1]);
        expect(gameboard.areAllShipsSunk()).toBe(true);
    });
    test('receiveAttack records a hit and returns "hit"', () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);

        gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);

        const result = gameboard.receiveAttack([0, 1]);

        expect(result).toBe('hit');
        expect(ship.hits).toBe(1);
    });

    test('receiveAttack records a miss and returns "miss"', () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);

        gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);

        const result = gameboard.receiveAttack([5, 5]);

        expect(result).toBe('miss');
        expect(gameboard.missedShots).toContainEqual([5, 5]);
        expect(ship.hits).toBe(0);
    });
    test('receiveAttack returns "invalid" for duplicate miss', () => {
        const gameboard = new Gameboard();

        gameboard.receiveAttack([5, 5]);
        const result = gameboard.receiveAttack([5, 5]);

        expect(result).toBe('invalid');
        expect(gameboard.missedShots.length).toBe(1);
    });
    test('receiveAttack returns "invalid" for duplicate hit', () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);

        gameboard.placeShip(ship, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);

        const first = gameboard.receiveAttack([0, 1]);
        const second = gameboard.receiveAttack([0, 1]);

        expect(first).toBe('hit');
        expect(second).toBe('invalid');
        expect(ship.hits).toBe(1);
    });
});
