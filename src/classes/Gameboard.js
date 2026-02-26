export class Gameboard {
    constructor() {
        this.board = [];
        this.ships = [];
        this.missedShots = [];
        for (let i = 0; i < 10; i++) {
            this.board.push(new Array(10).fill(null));
        }
    }

    placeShip = (ship, x, y, orientation) => {
        if (orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                if (x + i >= 10 || y >= 10 || x < 0 || y < 0) {
                    throw new Error(
                        'Invalid placement: Ship extends beyond the board boundaries.'
                    );
                } else if (this.board[y][x + i] !== null) {
                    throw new Error(
                        'Invalid placement: Ship overlaps with another ship.'
                    );
                }
            }
            for (let i = 0; i < ship.length; i++) {
                this.board[y][x + i] = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (y + i >= 10 || x >= 10 || x < 0 || y < 0) {
                    throw new Error(
                        'Invalid placement: Ship extends beyond the board boundaries.'
                    );
                } else if (this.board[y + i][x] !== null) {
                    throw new Error(
                        'Invalid placement: Ship overlaps with another ship.'
                    );
                }
            }
            for (let i = 0; i < ship.length; i++) {
                this.board[y + i][x] = ship;
            }
        }
        this.ships.push(ship);
    };
}
