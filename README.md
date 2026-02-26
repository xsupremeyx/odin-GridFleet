# Webpack Template (The Odin Project)

A minimal, opinionated **Webpack starter template** based on **The Odin Project** setup. This template is designed to get you productive quickly with a modern frontend workflow while keeping configuration understandable.

It includes:

- Webpack (development & production configs)
- Babel (for modern JavaScript)
- ESLint (flat config)
- Prettier (code formatting)
- Jest (unit testing)
- CSS & HTML loaders
- Asset handling (images & fonts)

---

## 📁 Project Structure

```
.
├── dist/                  # Production build output
│   ├── index.html
│   ├── main.bundle.js
│   └── main.bundle.js.map
├── src/                   # Application source
│   ├── index.js
│   ├── index.spec.js      # Jest tests
│   ├── styles.css
│   └── template.html
├── babel.config.js        # Babel configuration (CommonJS)
├── eslint.config.mjs      # ESLint flat config
├── webpack.common.js      # Shared Webpack config
├── webpack.dev.js         # Development config
├── webpack.prod.js        # Production config
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone & Install

```bash
npm install
```

---

## 🧪 Available Scripts

All scripts are defined in `package.json`:

### 🔧 Development Server

```bash
npm run start
```

- Starts `webpack-dev-server`
- Opens the browser automatically
- Hot reload enabled
- Uses `webpack.dev.js`

---

### 🏗️ Production Build

```bash
npm run build
```

- Creates an optimized build in `dist/`
- Uses `webpack.prod.js`
- Outputs hashed bundles and source maps

---

### 🧪 Run Tests (Jest)

```bash
npm test
```

- Runs all `*.test.js` / `*.spec.js` files
- Jest configured to work with Babel

---

### 🧹 Linting (ESLint)

```bash
npm run lint
```

Fix automatically where possible:

```bash
npm run lint:fix
```

---

### 🎨 Formatting (Prettier)

```bash
npm run format
```

Formats all supported files using Prettier.

---

### 🌍 Deploy to GitHub Pages (Left Incomplete Purposefully)

```bash
npm run deploy
```

- Pushes `dist/` to the `gh-pages` branch
- Uses `git subtree`
- Make sure `origin` is set correctly
- Note: This script is a starting point and may require adjustments based on your Git setup.

---

## 🛠️ Tooling Details

### Webpack

- Separate configs for dev & prod
- HTML generation via `html-webpack-plugin`
- Asset modules for images & fonts
- CSS handled with `style-loader` + `css-loader`

### Babel

- Uses `@babel/preset-env`
- Targets current Node for Jest
- Configured via `babel.config.js` (CommonJS for compatibility)

### ESLint

- Uses **ESLint flat config** (`eslint.config.mjs`)
- Browser globals for frontend code
- Node globals for config files
- Jest globals for test files
- Prettier rules applied to avoid conflicts

### Prettier

- Opinionated formatting
- Integrated cleanly with ESLint

### Jest

- Simple zero-boilerplate setup
- Works with Babel out of the box
- Test files live alongside source files

---

## 📌 Notes

- `node_modules/` and `dist/` are ignored by Git
- Config files are written in **CommonJS** to avoid Node/Babel/Jest issues
- Application code uses **ES Modules** (`import / export`)

---

## 📚 Inspiration

This template follows the setup and philosophy from:

- **The Odin Project** – Full Stack JavaScript Path

---

## 📄 License

ISC

---

Happy hacking! 🚀
