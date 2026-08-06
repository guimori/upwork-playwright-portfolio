# Playwright E2E Portfolio

End-to-end UI test automation project for a public e-commerce demo app.

Built to show how I structure a client-ready Playwright suite: clear scenarios, maintainable Page Objects, cross-browser coverage, CI, reports, screenshots, videos, and a portfolio MP4 demo.

Portfolio video: see the MP4 file in `artifacts/`.

## Highlights

- Playwright + TypeScript
- Page Object Model
- Chromium, Firefox, and WebKit execution
- 8 UI scenarios, 24 browser executions
- Videos recorded for every test run
- Screenshots on failure
- HTML report
- GitHub Actions CI
- Sequential MP4 demo with visible browser and red click highlights

## Covered Scenarios

| Area | Scenarios |
|---|---|
| Authentication | Valid login, invalid login, locked-out user |
| Inventory and cart | Add/remove item, sort by price, cart persistence |
| Checkout | Required field validation, successful purchase |

## Quick Start

```bash
npm install
npx playwright install
npm test
```

Windows PowerShell:

```powershell
npm.cmd install
npx.cmd playwright install
npm.cmd test
```

## Useful Commands

Run the full cross-browser suite:

```bash
npm test
```

Run Chromium only:

```bash
npm run test:chromium
```

Watch the tests in a visible browser:

```bash
npm run test:headed
```

Generate the portfolio MP4 demo:

```bash
npm run video:portfolio
```

Open the HTML report:

```bash
npm run report
```

## Evidence

Every test run records videos under `test-results/`.

The portfolio demo command creates:

```text
artifacts/portfolio-headed-demo-YYYY-MM-DD_HH-mm-ss.mp4
```

The demo video runs the main scenarios sequentially in one visible browser session.

## Project Structure

```text
.
|-- .github/workflows/playwright.yml
|-- artifacts/
|-- data/test-data.ts
|-- demos/portfolio-demo.spec.ts
|-- fixtures/click-highlight.ts
|-- pages/
|-- scripts/convert-latest-video.js
|-- tests/
|-- playwright.config.ts
|-- playwright.demo.config.ts
|-- package.json
`-- tsconfig.json
```

## Test App

This project uses SauceDemo, a public sample e-commerce website. No proprietary code, employer data, or private client material is included.
