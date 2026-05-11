# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal academic website for Xuanheng Huang (PhD student, Accounting, Bocconi University), deployed via GitHub Pages. It is a pure static site — no build system, no framework, no bundler.

## Local Development

Open `index.html` directly in a browser to preview. No server or build step required.

## CV Compilation

The CV lives in `cv/cv.tex` and is compiled to `cv/cv.pdf` using LaTeX:

```bash
cd cv && latexmk -pdf cv.tex
# or
cd cv && pdflatex cv.tex
```

Build artifacts (`.aux`, `.log`, `.out`, etc.) are git-ignored via `cv/.gitignore`. Only `cv.tex`, `cv.pdf`, and `cv/.gitignore` are tracked.

## Architecture

- **`index.html`** — Main page: profile, research papers (with collapsible abstracts), CV link, contact
- **`research.html`** — Dedicated research page
- **`cv.html`** — CV viewer page (embeds `cv/cv.pdf`)
- **`styles.css`** — All styling; uses CSS variables for light/dark themes (`:root` and `body.dark-mode`)
- **`script.js`** — Two features: abstract toggle (click-to-expand) and dark mode toggle (persisted via `localStorage`)
- **`cv/cv.tex`** — LaTeX source; uses custom `\resumeSubheading` macros, `tcolorbox`, and `fontawesome5`
- **`personal/places/`** — Interactive travel map (Leaflet + OpenStreetMap) and photo gallery

## Deployment

Push to `main` — GitHub Pages auto-deploys. No CI/CD configuration needed.
