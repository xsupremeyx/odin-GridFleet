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

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
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
    };

    const renderPlayerShips = () => {
        const player = GameController.getPlayer1();
        const ships = player.gameboard.ships;

        ships.forEach(({ coordinates }) => {
            coordinates.forEach(([row, col]) => {
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
        const player = GameController.getPlayer1();
        const enemy = GameController.getPlayer2();
        const playerAlive = player.gameboard.ships.filter(
            ({ ship }) => !ship.isSunk()
        ).length;

        const enemyAlive = enemy.gameboard.ships.filter(
            ({ ship }) => !ship.isSunk()
        ).length;

        statusBar.innerHTML = `
        <div>Your Ships: ${playerAlive}</div>
        <div>Enemy Ships: ${enemyAlive}</div>
        `;
    };

    const bindEnemyBoardEvents = () => {
        enemyBoardEl.addEventListener('click', (e) => {
            if (GameController.isGameOver()) return;
            const cell = e.target;
            if (
                !cell.classList.contains('cell') ||
                cell.classList.contains('hit') ||
                cell.classList.contains('miss')
            ) {
                return;
            }

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);

            GameController.playTurn([row, col]);

            renderBoards();

            const player = GameController.getPlayer1();
            const enemy = GameController.getPlayer2();

            renderPlayerShips();

            renderHits(enemyBoardEl, enemy.gameboard.hitShots);
            renderMisses(enemyBoardEl, enemy.gameboard.missedShots);

            renderHits(playerBoardEl, player.gameboard.hitShots);
            renderMisses(playerBoardEl, player.gameboard.missedShots);

            renderStatusBar();
            renderStatusBar();

            if (GameController.isGameOver()) {
                showEndgameModal();
            }
        });
    };

    const showEndgameModal = () => {
        const winner = GameController.getWinner();
        const modal = document.createElement('div');
        modal.classList.add('endgame-modal');

        modal.innerHTML = `
        <div class="modal-content">
            <h2>${winner.type === 'Player1' ? 'You Win! 🎉' : 'You Lose 😞'}</h2>
            <button id="restart-game">Play Again</button>
        </div>
        `;

        document.body.appendChild(modal);

        document.querySelector('#restart-game').addEventListener('click',() => {
            modal.remove();
            resetGame();
        });
    };

    const resetGame = () => {
        GameController.initGame();
        renderBoards();
        renderPlayerShips();
        renderStatusBar();
    };

    const renderMisses = (boardEl, missedShots) => {
        missedShots.forEach(([row, col]) => {
            const cell = boardEl.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) {
                cell.classList.add('miss');
            }
        });
    };

    const renderHits = (boardEl, hitShots) => {
        hitShots.forEach(([row, col]) => {
            const cell = boardEl.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) {
                cell.classList.add('hit');
            }
        });
    };

    const initUI = () => {
        GameController.initGame();
        cacheDom();
        renderBoards();
        renderPlayerShips();
        renderStatusBar();
        bindEnemyBoardEvents();
    };

    return {
        initUI,
    };
})();

export default DomController;
