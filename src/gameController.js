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

    const placeComputerShips = () => {
        const shipSizes = [3, 2];

        shipSizes.forEach((length) => {
            let placed = false;

            while (!placed) {
                const isHorizontal = Math.random() < 0.5;

                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);

                const coordinates = [];

                for (let i = 0; i < length; i++) {
                    const r = isHorizontal ? row : row + i;
                    const c = isHorizontal ? col + i : col;

                    if (r >= 10 || c >= 10) {
                        coordinates.length = 0;
                        break;
                    }

                    coordinates.push([r, c]);
                }

                if (coordinates.length !== length) continue;

                const overlapping = enemyPlayer.gameboard.ships.some(
                    ({ coordinates: existing }) =>
                        existing.some(([r, c]) =>
                            coordinates.some(([nr, nc]) => nr === r && nc === c)
                        )
                );

                if (overlapping) continue;

                enemyPlayer.gameboard.placeShip(new Ship(length), coordinates);
                placed = true;
            }
        });
    };

    const initGame = (mode) => {
        shipsToPlace = [3, 2]; // Example ship lengths for placement phase
        gameOver = false;
        winner = null;
        phase = 'placement';
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

    const startBattlePhase = () => {
        phase = 'battle';
    };

    // const playTurn = (coordinate) => {
    //     if (gameOver || phase !== 'battle') return;

    //     const playerResult = player1.attack(player2, coordinate);
    //     if (playerResult.result === 'invalid') return;

    //     if (player2.gameboard.areAllShipsSunk()) {
    //         gameOver = true;
    //         winner = player1;
    //         return;
    //     }

    //     player2.makeRandomAttack(player1);

    //     if (player1.gameboard.areAllShipsSunk()) {
    //         gameOver = true;
    //         winner = player2;
    //     }
    // };

    const playTurn = (coordinate) => {
        if (gameOver || phase !== 'battle') return;

        const result = currentPlayer.attack(enemyPlayer, coordinate);

        if (result.result === 'invalid') return;

        if (enemyPlayer.gameboard.areAllShipsSunk()) {
            gameOver = true;
            winner = currentPlayer;
            return;
        }

        if (gameMode === 'pvc') {
            // Computer automatically plays
            enemyPlayer.makeRandomAttack(currentPlayer);

            if (currentPlayer.gameboard.areAllShipsSunk()) {
                gameOver = true;
                winner = enemyPlayer;
            }
        } else {
            // PvP mode → swap players
            [currentPlayer, enemyPlayer] = [enemyPlayer, currentPlayer];
        }
    };

    const placePlayerShip = (row, col) => {
        if (phase !== 'placement') return false;
        if (shipsToPlace.length === 0) return false;

        const length = shipsToPlace[0];

        const coordinates = [];
        for (let i = 0; i < length; i++) {
            if (col + i >= 10) return false; // Ensure ship doesn't go out of bounds
            coordinates.push([row, col + i]);
        }

        const overlapping = player1.gameboard.ships.some(
            ({ coordinates: existing }) =>
                existing.some(([r, c]) =>
                    coordinates.some(([nr, nc]) => nr === r && nc === c)
                )
        );

        if (overlapping) return false;

        player1.gameboard.placeShip(new Ship(length), coordinates);
        shipsToPlace.shift();

        if (shipsToPlace.length === 0) {
            startBattlePhase();
            placeComputerShips(); // temporarily place AI
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
        startBattlePhase,
        getShipsToPlace,
        placePlayerShip,
    };
})();

export default GameController;
