export class Gameboard {
    constructor() {
        this.ships = [];
        this.missedShots = [];
        this.hitShots = [];
    }

    placeShip = (ship, coordinates) => {
        this.ships.push({ ship, coordinates });
    };

    receiveAttack = (coordinate) => {
        if (
            this.missedShots.some(
                ([r, c]) => r === coordinate[0] && c === coordinate[1]
            ) ||
            this.hitShots.some(
                ([r, c]) => r === coordinate[0] && c === coordinate[1]
            )
        ) {
            return { result: 'invalid', sunk: false };
        }
        for (const { ship, coordinates } of this.ships) {
            for (const [r, c] of coordinates) {
                if (r === coordinate[0] && c === coordinate[1]) {
                    ship.hit();
                    this.hitShots.push(coordinate);
                    return { result: 'hit', sunk: ship.isSunk() };
                }
            }
        }

        this.missedShots.push(coordinate);
        return { result: 'miss', sunk: false };
    };

    areAllShipsSunk = () => {
        return this.ships.every(({ ship }) => ship.isSunk());
    };
}
