# ipo.guide

A beginner-friendly, multi-page website explaining the SpaceX and Anthropic IPOs to first-time investors. Built as a portfolio project by a data analytics student learning React for the first time.

🔗 **Live site:** [ipo.guide](https://ipo.guide)

---

## What's inside

| Page | Description |
|---|---|
| **Home** | Overview of both IPOs with live countdown timers |
| **Learn** | Company fundamentals, key numbers, and custom SVG valuation sparklines |
| **Risk** | Historical IPO case studies with post-IPO performance charts |
| **Tools** | Investment calculator, scenario planner (Bear/Base/Bull), and a risk score quiz |
| **Newsletter** | Signup form connected to Google Sheets via Google Apps Script |

---

## Tech stack

- **React** + **React Router** — frontend and routing
- **Custom SVG** — all charts and sparklines hand-coded, no charting library
- **Google Apps Script → Google Sheets** — newsletter backend
- **Vercel** — deployment, auto-deploys on git push
- **Total cost: $0**

---

## Features

- Light / dark mode toggle (saved to localStorage)
- Fully mobile responsive (768px breakpoint)
- Live countdown timers to IPO dates
- Investment calculator with 5 price targets
- Risk score quiz with investor profile output (Bear / Base / Bull)

---

## Running locally

```bash
git clone https://github.com/23bananasinmytummy/ipo-explainer.git
cd ipo-explainer
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project structure

```
src/
├── pages/
│   ├── Home.jsx
│   ├── Learn.jsx
│   ├── Risk.jsx
│   ├── Tools.jsx
│   └── Newsletter.jsx
├── App.js
└── index.js
```

---

## Disclaimer

This website is for informational and educational purposes only. It does not constitute financial advice. Always do your own research before making investment decisions.

---

## Author

**Henry Yeo** — Data Analytics Student, Singapore
[LinkedIn](https://www.linkedin.com/in/henry-yeo-ba6408299/) · [GitHub](https://github.com/23bananasinmytummy) · [Instagram](https://www.instagram.com/henry.ykd/)

---

MIT License © 2026 Henry Yeo
