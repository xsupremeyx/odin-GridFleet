# GridFleet ⚓

A modern, turn-based naval strategy game built with vanilla JavaScript.

GridFleet is a polished Battleship-style game developed as the **final
JavaScript project** for **The Odin Project**.\
It demonstrates modular architecture, state management, clean UI
rendering, and disciplined Git workflow.


------------------------------------------------------------------------

## Live Demo:
[https://xsupremeyx.github.io/odin-GridFleet/](https://xsupremeyx.github.io/odin-GridFleet/)

------------------------------------------------------------------------

## 🎓 Built For

This project was completed as part of:

**The Odin Project --- Full Stack JavaScript Path**\
Final JavaScript Project

It focuses on applying:

-   Test-driven design principles
-   Object-oriented programming
-   Modular architecture
-   Separation of concerns
-   Clean UI architecture

------------------------------------------------------------------------

## 🚀 Features

-   🎮 Player vs Player mode
-   🤖 Player vs Computer mode
-   🔁 Turn-based perspective switching
-   🚢 Ship placement with rotation
-   💥 Hit / Miss feedback
-   🏴 Sunk ship detection
-   🎨 Fully custom UI (no frameworks)
-   📱 Responsive layout
-   🧩 Clean branch-based Git workflow
-   🏷 Versioned release (v1.0.0)

------------------------------------------------------------------------

## 🛠 Tech Stack

-   HTML5
-   CSS3 (Custom properties + animations)
-   Vanilla JavaScript (ES Modules)
-   Jest (for unit testing TDD)
-   Modular and Object Oriented Class architecture pattern
-   Git (feature branch workflow)
-   Webpack (for bundling and development server)
-   Linting with ESLint
-   Formatting with Prettier

No external libraries used.

------------------------------------------------------------------------

## 🧠 Architecture Overview

The project follows a separation-of-concerns structure:

GameController
DomController

Gameboard
Player
Ship

### Responsibilities

-   **GameController** → Core game logic & state management\
-   **Player** → Attack logic and turn handling\
-   **Gameboard** → Ship placement, hit tracking, win detection\
-   **Ship** → Individual ship state (hits, sunk detection)\
-   **DomController** → UI rendering and DOM interaction

This separation keeps logic independent from UI and makes the codebase
maintainable.

------------------------------------------------------------------------

## 🎯 Gameplay Flow

1.  Select game mode (PvP or PvC)
2.  Players place ships
3.  Battle phase begins
4.  Turns alternate
5.  Ships get hit, missed, or sunk
6.  Winner screen displayed
7.  Restart option available

------------------------------------------------------------------------

## 📂 Project Structure

src/\
├── classes/\
│ ├── Player.js\
│ ├── Gameboard.js\
│ └── Ship.js\
├── gameController.js\
├── domController.js\
├── index.js\
└── styles.css

(Not including the test files here)
------------------------------------------------------------------------

## 🧪 Running Locally

Use any static server:

npm install

npm run start

Then visit:

http://localhost:8080

------------------------------------------------------------------------

## Version

**v1.0.0**\
Stable release with PvP + PvC modes and polished UI.

------------------------------------------------------------------------


## 📜 License

Built as part of The Odin Project curriculum --- Final JavaScript
Project.