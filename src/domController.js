import GameController from './gameController.js';

const DomController = (() => {
    const initUI = () => {
        GameController.initGame();
    };

    return {
        initUI,
    };
})();

export default DomController;
