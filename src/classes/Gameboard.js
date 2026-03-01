export class Gameboard {
    constructor() {
        this.ships = [];
        this.missedShots = [];
    }

    placeShip = (ship, coordinates) => {
        this.ships.push({ ship, coordinates });
    };

    receiveAttack = (coordinate) => {
        let hit = false;
        for (let i = 0; i < this.ships.length; i++) {
            const { ship, coordinates } = this.ships[i];
            for (let j = 0; j < coordinates.length; j++) {
                if (
                    coordinates[j][0] === coordinate[0] &&
                    coordinates[j][1] === coordinate[1]
                ) {
                    ship.hit();
                    hit = true;
                    break;
                }
            }
            if (hit) break;
        }
        if (!hit) {
            this.missedShots.push(coordinate);
        }
    };

    areAllShipsSunk = () => {
        return this.ships.every(({ ship }) => ship.isSunk());
    };
}
