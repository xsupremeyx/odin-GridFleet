/* eslint-disable no-unused-vars */
import GameController from './gameController.js';

const DomController = (() => {
    let app;
    let statusBar;
    let playerBoardEl;
    let enemyBoardEl;

    const cacheDom = () => {
        app = document.querySelector('#app');
        statusBar = document.querySelector('#status-bar');
        playerBoardEl = document.querySelector('#player-board');
        enemyBoardEl = document.querySelector('#enemy-board');
    };

    const createEmptyBoard = (boardEl) => {
        boardEl.innerHTML = '';
        boardEl.classList.add('grid');

        for(let row = 0; row < 10; row++){
            for(let col = 0; col < 10; col++){
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                boardEl.appendChild(cell);
            }
        }
    };

    const renderBoards = () => {
        createEmptyBoard(playerBoardEl);
        createEmptyBoard(enemyBoardEl);
    }

    const renderPlayerShips = () => {
        const player = GameController.getCurrentPlayer();
        const ships = player.gameboard.ships;

        ships.forEach(({coordinates}) => {
            coordinates.forEach(([row,col]) => {
                const cell = playerBoardEl.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );
                if (cell) {
                    cell.classList.add('ship');
                }
            });
        });
        console.log('Player ships rendered');
    };

    const renderStatusBar = () => {
        const player = GameController.getCurrentPlayer();
        const enemy = GameController.getEnemyPlayer();
        const playerAlive = player.gameboard.ships.filter(
            ({ship}) => !ship.isSunk()
        ).length;

        const enemyAlive = enemy.gameboard.ships.filter(
            ({ship}) => !ship.isSunk()
        ).length;

        statusBar.innerHTML = `
        <div>Your Ships: ${playerAlive}</div>
        <div>Enemy Ships: ${enemyAlive}</div>
        `;  
    };



    const initUI = () => {
        GameController.initGame();
        cacheDom();
        renderBoards();
        renderPlayerShips();
        renderStatusBar();
    };

    return {
        initUI,
    };
})();

export default DomController;
