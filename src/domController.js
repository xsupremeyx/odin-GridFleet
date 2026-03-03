/* global setTimeout */

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

    const renderHeroScreen = () => {
        app.innerHTML = `
        <main class="hero-screen">
            <section class="hero-content">
                <h1 class="game-title">GridFleet</h1>

                <div class="mode-selector">
                    <button data-mode="pvc">Player vs Computer</button>
                    <button data-mode="pvp">Player vs Player</button>
                </div>

                <button id="start-game" class="primary-btn">Start Game</button>
            </section>
        </main>
        `;
        bindHeroEvents();
    };

    const bindHeroEvents = () => {
        const modeButtons = document.querySelectorAll('[data-mode]');
        const startBtn = document.querySelector('#start-game');

        let selectedMode = null;

        modeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedMode = btn.dataset.mode;

                modeButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        startBtn.addEventListener('click', () => {
            if (!selectedMode) return;

            GameController.initGame(selectedMode);

            transitionTo(renderPlacementScreen, renderPlacementSetup);
        });
    };

    const renderPlacementScreen = () => {
        app.innerHTML = `
        <main class="placement-screen">
            <header id="status-bar"></header>

            <section class="placement-controls">
                <div id="ship-selector"></div>
                <button id="rotate-ship">Rotate</button>
            </section>

            <section class="board-section">
                <div id="player-board" class="board"></div>
            </section>
        </main>
        `;
        cacheDom();
    };

    const renderPlacementSetup = () => {
        bindRotateButton();
        renderPlayerBoard();
        renderPlayerShips();
        renderPlacementStatus();
        bindPlayerBoardPlacement();
        bindPlacementHover();
    };

    const bindRotateButton = () => {
        const rotateBtn = document.querySelector('#rotate-ship');

        rotateBtn.addEventListener('click', () => {
            GameController.toggleRotation();
            rotateBtn.classList.toggle('active');
        });
    };

    const renderPlacementStatus = () => {
        const shipsLeft = GameController.getShipsToPlace();

        statusBar.innerHTML = `
            <div>Ships Left To Place: ${shipsLeft.length}</div>
        `;
    };

    const renderBattleScreen = () => {
        app.innerHTML = `
            <main class="battle-screen">
                <header id="status-bar"></header>

                <section class="boards-wrapper">
                    <div class="board-container">
                        <h2>Your Fleet</h2>
                        <div id="player-board" class="board"></div>
                    </div>

                    <div class="board-container">
                        <h2>Enemy Waters</h2>
                        <div id="enemy-board" class="board"></div>
                    </div>
                </section>
            </main>
        `;
        cacheDom();
    };

    const transitionTo = (renderFn, afterRender) => {
        const current = app.firstElementChild;

        if (current) {
            current.classList.add('slide-out');

            setTimeout(() => {
                renderFn();

                const next = app.firstElementChild;
                next.classList.add('slide-in');

                if (afterRender) afterRender();
            }, 300);
        } else {
            renderFn();
            const next = app.firstElementChild;
            next.classList.add('slide-in');

            if (afterRender) afterRender();
        }
    };

    const createEmptyBoard = (boardEl) => {
        boardEl.innerHTML = '';

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

    const renderPlayerBoard = () => {
        createEmptyBoard(playerBoardEl);
    };

    const renderBattleBoards = () => {
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

    const renderEnemyShipsForDebug = () => {
        const enemy = GameController.getPlayer2();

        enemy.gameboard.ships.forEach(({ coordinates }) => {
            coordinates.forEach(([row, col]) => {
                const cell = enemyBoardEl.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );

                if (cell) {
                    cell.classList.add('ship');
                    cell.style.opacity = '0.4'; // visually distinguish from player ships
                }
            });
        });
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

            renderBattleBoards();

            const player = GameController.getPlayer1();
            const enemy = GameController.getPlayer2();

            renderPlayerShips();

            renderHits(enemyBoardEl, enemy.gameboard.hitShots);
            renderMisses(enemyBoardEl, enemy.gameboard.missedShots);

            renderHits(playerBoardEl, player.gameboard.hitShots);
            renderMisses(playerBoardEl, player.gameboard.missedShots);

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

        document
            .querySelector('#restart-game')
            .addEventListener('click', () => {
                modal.remove();
                resetGame();
            });
    };
    const resetGame = () => {
        transitionTo(renderHeroScreen);
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

    const bindPlayerBoardPlacement = () => {
        playerBoardEl.addEventListener('click', (e) => {
            if (GameController.getPhase() !== 'placement') return;

            const cell = e.target;
            if (!cell.classList.contains('cell')) return;

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);

            const placed = GameController.placePlayerShip(row, col);
            if (placed) {
                if (GameController.getPhase() === 'battle') {
                    transitionTo(renderBattleScreen, renderBattleSetup);
                    return;
                }
                renderPlayerBoard();
                renderPlayerShips();
                renderPlacementStatus();
            }
        });
    };

    const bindPlacementHover = () => {
        playerBoardEl.addEventListener('mouseover', handlePreview);
        playerBoardEl.addEventListener('mouseout', clearPreview);
    };

    const handlePreview = (e) => {
        if (GameController.getPhase() !== 'placement') return;

        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        clearPreview();

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        const length = GameController.getCurrentShipLength();
        if (!length) return;

        const isHorizontal = GameController.getOrientation();

        const coords = GameController.generateCoordinates(
            row,
            col,
            length,
            isHorizontal
        );

        if (!coords) {
            // Show invalid preview for attempted cells
            const fallbackCoords = [];

            for (let i = 0; i < length; i++) {
                const r = isHorizontal ? row : row + i;
                const c = isHorizontal ? col + i : col;

                fallbackCoords.push([r, c]);
            }

            applyPreview(fallbackCoords, false);
            return;
        }

        const valid = GameController.canPlaceShip(
            GameController.getPlayer1(),
            coords
        );

        applyPreview(coords, valid);
    };

    const applyPreview = (coords, isValid) => {
        coords.forEach(([r, c]) => {
            const cell = playerBoardEl.querySelector(
                `.cell[data-row="${r}"][data-col="${c}"]`
            );

            if (cell) {
                cell.classList.add(
                    isValid ? 'preview-valid' : 'preview-invalid'
                );
            }
        });
    };

    const clearPreview = () => {
        const cells = playerBoardEl.querySelectorAll(
            '.preview-valid, .preview-invalid'
        );

        cells.forEach((cell) => {
            cell.classList.remove('preview-valid', 'preview-invalid');
        });
    };

    const renderBattleSetup = () => {
        renderBattleBoards();
        renderPlayerShips();
        renderStatusBar();
        bindEnemyBoardEvents();

        // For debugging: show enemy ships
        renderEnemyShipsForDebug();
    };

    const initUI = () => {
        cacheDom();
        transitionTo(renderHeroScreen);
    };

    return {
        initUI,
    };
})();

export default DomController;
