import { Player } from './classes/Player.js';
import { Ship } from './classes/Ship.js';

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let enemyPlayer;

    let gameOver;
    let winner;

    const hardCodedShips = () => {
        currentPlayer.gameboard.placeShip(new Ship(3), [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        currentPlayer.gameboard.placeShip(new Ship(2), [
            [2, 0],
            [2, 1],
        ]);
        enemyPlayer.gameboard.placeShip(new Ship(3), [
            [5, 5],
            [5, 6],
            [5, 7],
        ]);
        enemyPlayer.gameboard.placeShip(new Ship(2), [
            [7, 3],
            [7, 4],
        ]);
    };

    const initGame = () => {
        gameOver = false;
        winner = null;
        player1 = new Player('Player1');
        player2 = new Player('Computer');
        currentPlayer = player1;
        enemyPlayer = player2;
        hardCodedShips();
    };

    const getCurrentPlayer = () => currentPlayer;
    const getEnemyPlayer = () => enemyPlayer;
    const isGameOver = () => gameOver;
    const getWinner = () => winner;
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    // const switchPlayer = () => {
    //     [currentPlayer, enemyPlayer] = [enemyPlayer, currentPlayer];
    // };

    const playTurn = (coordinate) => {
        if (gameOver) return;

        const playerResult = player1.attack(player2, coordinate);
        if (playerResult === 'invalid') return;

        if (player2.gameboard.areAllShipsSunk()) {
            gameOver = true;
            winner = player1;
            return;
        }

        player2.makeRandomAttack(player1);

        if (player1.gameboard.areAllShipsSunk()) {
            gameOver = true;
            winner = player2;
        }
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
    };
})();

export default GameController;
