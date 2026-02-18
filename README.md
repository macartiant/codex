# DDQ Assistant Slides Prototype

This repository now uses a presentation-folder architecture so each deck can be managed as modular slide subfolders.

## Architecture

- `Agile/` is the presentation folder.
- `Agile/index.json` defines the ordered sequence of slides.
- Each slide lives in its own subfolder (for example, `Agile/slide-01/`).
- Each slide subfolder includes an `index.json` file that defines content and interaction reveal order.
- Slide-specific assets can be stored alongside that slide's `index.json`.

The root `script.js` fetches the presentation index, then fetches each slide's `index.json` from its subfolder.

## Run locally

### Option 1: Python built-in server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Tip: press `F11` (or your browser fullscreen shortcut) for full presentation mode.

### Option 2: Direct file open

You can open `index.html` directly in your browser, though using a local server is recommended.

## Slide interaction

- Elements reveal one by one with fade-in transitions.
- Use **Right Arrow** to move forward through reveals.
- Use **Left Arrow** to move backward.
- You can also use **Next/Previous** buttons.
