# Academic Academic Academic Paper Generator 1.0

## Description

This is an Academic Paper Generator. A project inspired by [Chicken Chicken Chicken](https://www.wired.com/images_blogs/wiredscience/files/chicken.pdf) and [Get me off Your Fucking Mailing List](https://isotropic.org/papers/chicken.pdf).

Created by Yufeng Zhao and Jingtian Zong.

Special thanks to Richard Huang.

## How it works

Takes your input, generates a paper in LaTeX, and compiles it to PDF entirely in the browser using [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX) (WebAssembly). The app is 100% client-based — no data is sent to any server.

## Running locally

```bash
npx serve public
```

## Changelog

- **v3.0 — March 2026** (`swiftlatex-wasm` branch): Moved to client-side PDF compilation using [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX) WASM. No server required — everything runs in the browser.
- **v2.0 — April/May 2021** (`docker` branch): Replaced CloudConvert with a Docker-based LaTeX compiler deployed on Heroku, hosted at `https://aaa-paper-generator.herokuapp.com/`. Generated papers were collected to a Google Cloud Storage bucket during this period. The Heroku deployment and data collection have since stopped.
- **v1.0 — April 2021** (`master` branch): Initial release. Used the [CloudConvert](https://cloudconvert.com/) API for server-side LaTeX-to-PDF conversion.
