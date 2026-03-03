/* global setTimeout */

import GameController from './gameController.js';

const DomController = (() => {
    let app;
    let statusBar;
    let playerBoardEl;
    let enemyBoardEl;
    let isProcessingTurn = false;

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
        const player = GameController.getCurrentPlayer();
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
    };

    const renderStatusBar = () => {
        const current = GameController.getCurrentPlayer();
        const enemy = GameController.getEnemyPlayer();

        const currentAlive = current.gameboard.ships.filter(
            ({ ship }) => !ship.isSunk()
        ).length;

        const enemyAlive = enemy.gameboard.ships.filter(
            ({ ship }) => !ship.isSunk()
        ).length;

        statusBar.innerHTML = `
            <div>Your Ships: ${currentAlive}</div>
            <div>Enemy Ships: ${enemyAlive}</div>
        `;
    };

    const bindBattleEvents = () => {
        // Remove previous handlers
        playerBoardEl.onclick = null;
        enemyBoardEl.onclick = null;
        if (GameController.getPhase() !== 'battle') return;
        enemyBoardEl.onclick = handleBattleClick;
    };

    const handleBattleClick = (e) => {
        if (isProcessingTurn) return;
        if (GameController.isGameOver()) return;

        const cell = e.target;

        if (
            !cell.classList.contains('cell') ||
            cell.classList.contains('hit') ||
            cell.classList.contains('miss')
        )
            return;

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        isProcessingTurn = true;
        GameController.playTurn([row, col]);

        renderBattleSetup();

        if (GameController.isGameOver()) {
            isProcessingTurn = false;
            showEndgameModal();
            return;
        }

        // PVC MODE
        if (GameController.getGameMode() === 'pvc') {
            enemyBoardEl.classList.add('disabled');

            setTimeout(() => {
                // Switch to computer
                GameController.switchTurn();

                // Computer attacks
                GameController.getCurrentPlayer().makeRandomAttack(
                    GameController.getEnemyPlayer()
                );

                // Check if human lost
                if (
                    GameController.getEnemyPlayer().gameboard.areAllShipsSunk()
                ) {
                    GameController.setWinner(GameController.getCurrentPlayer());
                    renderBattleSetup();

                    isProcessingTurn = false;
                    enemyBoardEl.classList.remove('disabled');

                    showEndgameModal();
                    return;
                }

                // Switch back to human
                GameController.switchTurn();

                renderBattleSetup();

                isProcessingTurn = false;
                enemyBoardEl.classList.remove('disabled');
            }, 800);

            return;
        }
        // 🔥 PvP MODE
        setTimeout(() => {
            showTurnOverlay();
        }, 900);
    };

    const showTurnOverlay = () => {
        const current = GameController.getCurrentPlayer();
        const nextPlayer =
            current.type === 'Player1'
                ? GameController.getPlayer2()
                : GameController.getPlayer1();

        const overlay = document.createElement('div');
        overlay.classList.add('turn-overlay');

        overlay.innerHTML = `
            <div class="turn-box">
                <h2>${nextPlayer.type}'s Turn</h2>
                <button id="continue-turn">Continue</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document
            .querySelector('#continue-turn')
            .addEventListener('click', () => {
                overlay.remove();

                GameController.switchTurn(); // NOW swap
                renderBattleSetup(); // Render new perspective
                isProcessingTurn = false;
            });
    };

    const showEndgameModal = () => {
        const winner = GameController.getWinner();
        const mode = GameController.getGameMode();

        let message;

        if (mode === 'pvc') {
            message =
                winner.type === 'Player1' ? 'You Win! 🎉' : 'Computer Wins 🤖';
        } else {
            message = `${winner.type} Wins! 🎉`;
        }

        const modal = document.createElement('div');
        modal.classList.add('endgame-modal');

        modal.innerHTML = `
        <div class="modal-content">
            <h2>${message}</h2>
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
            if (!GameController.getPhase().startsWith('placement')) return;

            const cell = e.target;
            if (!cell.classList.contains('cell')) return;

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);

            const previousPhase = GameController.getPhase();
            const placed = GameController.placePlayerShip(row, col);

            if (placed) {
                const newPhase = GameController.getPhase();

                if (
                    previousPhase === 'placement-p1' &&
                    newPhase === 'placement-p2'
                ) {
                    transitionTo(renderPlacementScreen, renderPlacementSetup);
                    return;
                }

                if (newPhase === 'battle') {
                    transitionTo(renderBattleScreen, renderBattleSetup);
                    return;
                }

                renderPlayerBoard();
                renderPlayerShips();
                renderStatusBar();
            }
        });
    };

    const bindPlacementHover = () => {
        playerBoardEl.addEventListener('mouseover', handlePreview);
        playerBoardEl.addEventListener('mouseout', clearPreview);
    };

    const handlePreview = (e) => {
        if (!GameController.getPhase().startsWith('placement')) return;

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
            GameController.getCurrentPlayer(),
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

        const current = GameController.getCurrentPlayer();
        const enemy = GameController.getEnemyPlayer();

        // LEFT BOARD → Your Fleet (current player)
        current.gameboard.ships.forEach(({ coordinates }) => {
            coordinates.forEach(([row, col]) => {
                const cell = playerBoardEl.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );
                if (cell) cell.classList.add('ship');
            });
        });

        // Enemy shots on current player
        renderHits(playerBoardEl, current.gameboard.hitShots);
        renderMisses(playerBoardEl, current.gameboard.missedShots);

        // RIGHT BOARD → Enemy Waters (shot history of current player)
        renderHits(enemyBoardEl, enemy.gameboard.hitShots);
        renderMisses(enemyBoardEl, enemy.gameboard.missedShots);

        renderStatusBar();
        bindBattleEvents();
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
