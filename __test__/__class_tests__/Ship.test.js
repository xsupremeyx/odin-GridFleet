import { Ship } from '../../src/classes/Ship';

describe('Ship', () => {
    test('Ship Object Creation', () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });
    test('Initial hit status', () => {
        const ship = new Ship(3);
        expect(ship.hits).toBe(0);
        ship.hit();
        expect(ship.hits).toBe(1);
    });
    test('isSunk Method Check', () => {
        const ship = new Ship(2);
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.hits).toBe(1);
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.hits).toBe(2);
        expect(ship.isSunk()).toBe(true);
    });
});
