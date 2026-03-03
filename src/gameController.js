import { Player } from './classes/Player.js';
import { Ship } from './classes/Ship.js';

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let enemyPlayer;

    let gameOver;
    let winner;
    let phase;
    let shipsToPlace;
    let gameMode;
    let isHorizontal = true; // default orientation for ship placement

    const generateCoordinates = (row, col, length, isHorizontal) => {
        const coordinates = [];

        for (let i = 0; i < length; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;

            if (r >= 10 || c >= 10) return null;

            coordinates.push([r, c]);
        }

        return coordinates;
    };

    const canPlaceShip = (player, coordinates) => {
        return !player.gameboard.ships.some(({ coordinates: existing }) =>
            existing.some(([r, c]) =>
                coordinates.some(([nr, nc]) => nr === r && nc === c)
            )
        );
    };

    const toggleRotation = () => {
        isHorizontal = !isHorizontal;
    };

    const placeComputerShips = () => {
        const shipSizes = [3, 2];

        shipSizes.forEach((length) => {
            let placed = false;

            while (!placed) {
                const isHorizontal = Math.random() < 0.5;
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);

                const coordinates = generateCoordinates(
                    row,
                    col,
                    length,
                    isHorizontal
                );

                if (!coordinates) continue;

                if (!canPlaceShip(enemyPlayer, coordinates)) continue;

                enemyPlayer.gameboard.placeShip(new Ship(length), coordinates);

                placed = true;
            }
        });
    };

    const initGame = (mode) => {
        isHorizontal = true;
        shipsToPlace = [3, 2]; // Example ship lengths for placement phase
        gameOver = false;
        winner = null;
        phase = 'placement-p1';
        gameMode = mode;

        player1 = new Player('Player1');
        player2 = new Player(mode === 'pvp' ? 'Player2' : 'Computer');
        currentPlayer = player1;
        enemyPlayer = player2;

        // hardCodedShips();
    };

    const getCurrentPlayer = () => currentPlayer;
    const getEnemyPlayer = () => enemyPlayer;
    const isGameOver = () => gameOver;
    const getWinner = () => winner;
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const getPhase = () => phase;
    const getShipsToPlace = () => shipsToPlace;
    const getCurrentShipLength = () => shipsToPlace[0];
    const getOrientation = () => isHorizontal;
    const getGameMode = () => gameMode;

    const playTurn = (coordinate) => {
        if (gameOver || phase !== 'battle') return;

        const result = currentPlayer.attack(enemyPlayer, coordinate);

        if (!result || result.result === 'invalid') return;

        if (enemyPlayer.gameboard.areAllShipsSunk()) {
            gameOver = true;
            winner = currentPlayer;
        }
    };
    const setWinner = (player) => {
        winner = player;
        gameOver = true;
    };

    const switchTurn = () => {
        [currentPlayer, enemyPlayer] = [enemyPlayer, currentPlayer];
    };

    const placePlayerShip = (row, col) => {
        if (!phase.startsWith('placement')) return false;
        if (shipsToPlace.length === 0) return false;

        const length = shipsToPlace[0];

        const coordinates = generateCoordinates(row, col, length, isHorizontal);

        if (!coordinates) return false;

        if (!canPlaceShip(currentPlayer, coordinates)) return false;

        currentPlayer.gameboard.placeShip(new Ship(length), coordinates);

        shipsToPlace.shift();

        if (shipsToPlace.length === 0) {
            if (gameMode === 'pvp') {
                if (phase === 'placement-p1') {
                    // Switch to Player 2 placement
                    phase = 'placement-p2';
                    shipsToPlace = [3, 2];

                    currentPlayer = player2;
                    enemyPlayer = player1;

                    isHorizontal = true; // reset orientation
                } else {
                    // Both players placed → battle begins
                    phase = 'battle';
                    currentPlayer = player1;
                    enemyPlayer = player2;
                }
            } else {
                // PVC
                phase = 'battle';
                placeComputerShips();
            }
        }

        return true;
    };

    return {
        initGame,
        getCurrentPlayer,
        getEnemyPlayer,
        playTurn,
        isGameOver,
        getWinner,
        getPlayer1,
        getPlayer2,
        getPhase,
        getShipsToPlace,
        placePlayerShip,
        toggleRotation,
        generateCoordinates,
        canPlaceShip,
        getCurrentShipLength,
        getOrientation,
        switchTurn,
        getGameMode,
        setWinner,
    };
})();

export default GameController;
