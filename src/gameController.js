import { Player } from './classes/Player.js';
import { Ship } from './classes/Ship.js';


const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let enemyPlayer;

    const hardCodedShips = () => {
        currentPlayer.gameboard.placeShip(new Ship(3), [
            [0, 0], 
            [0, 1], 
            [0, 2]
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
        player1 = new Player('Player1');
        player2 = new Player('Computer');
        currentPlayer = player1;
        enemyPlayer = player2;
        hardCodedShips();
    };

    const getCurrentPlayer = () => currentPlayer;
    const getEnemyPlayer = () => enemyPlayer;

    const switchPlayer = () => {
        [currentPlayer, enemyPlayer] = [enemyPlayer, currentPlayer];
    };

    const playTurn = (coordinate) => {
        if (currentPlayer.type === 'Computer') {
            currentPlayer.makeRandomAttack(enemyPlayer);
        } else {
            currentPlayer.attack(enemyPlayer, coordinate);
        }
        switchPlayer();
    }

    return {
        initGame,
        getCurrentPlayer,
        getEnemyPlayer,
        playTurn,
    };
})();

export default GameController;