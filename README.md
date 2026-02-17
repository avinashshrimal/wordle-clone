# 🟩 Wordle Clone

A fully-featured Wordle clone built with React — includes daily words, practice mode, hard mode, stats tracking, streaks, and 2,300+ words from the official Wordle answer list.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## ✨ Features

- 🗓️ **Daily Word** — same word for everyone each day, resets at midnight
- 🔁 **Practice Mode** — unlimited random games anytime
- 💪 **Hard Mode** — must reuse revealed hints in future guesses
- 📊 **Stats & Streaks** — tracks games played, win %, current streak, max streak, and guess distribution
- 💾 **Persistent State** — progress and stats saved in localStorage (won't reset on refresh)
- 🟩 **2,300+ Words** — full official Wordle answer list embedded
- ⌨️ **Physical Keyboard Support** — type normally or click the on-screen keyboard
- ❓ **How to Play Modal** — built-in tutorial for new players

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher).

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/wordle-clone.git

# 2. Move into the project folder
cd wordle-clone

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
wordle-clone/
├── public/
│   └── index.html
├── src/
│   ├── App.js          ← Main game component (paste wordle-pro.jsx content here)
│   └── index.js        ← React entry point
├── package.json
└── README.md
```

---

## 🎮 How to Play

| Color | Meaning |
|-------|---------|
| 🟩 Green | Correct letter, correct position |
| 🟨 Yellow | Correct letter, wrong position |
| ⬛ Gray | Letter not in the word |

- You have **6 guesses** to find the hidden 5-letter word
- Each guess must be a valid English word
- In **Hard Mode**, any revealed hints must be used in subsequent guesses

---

## 🛠️ Built With

- [React](https://reactjs.org/) — UI framework
- [Create React App](https://create-react-app.dev/) — project scaffolding
- CSS-in-JS — all styles written inline for portability
- `localStorage` — for persisting stats and daily game state

---

## 📦 Deployment

### Deploy to GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json
#    "homepage": "https://YOUR_USERNAME.github.io/wordle-clone"
#    "scripts": { "predeploy": "npm run build", "deploy": "gh-pages -d build" }

# 3. Deploy
npm run deploy
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Original Wordle by [Josh Wardle](https://www.powerlanguage.co.uk/)
- Word list sourced from the official NYT Wordle game
