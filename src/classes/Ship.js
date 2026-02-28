export class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    isSunk = () => {
        if (this.hits >= this.length) {
            return true;
        }
        return false;
    };

    hit = () => {
        this.hits++;
    };
}
