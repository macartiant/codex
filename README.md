# DDQ Assistant Slides Prototype

This repository contains a code-based first slide for a short presentation on an iterative incremental approach to building an assistant for due diligence questionnaires. The slide now stretches to use the full browser viewport.

## Run locally

### Option 1: Python built-in server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Tip: press `F11` (or your browser fullscreen shortcut) for a true presentation mode.

### Option 2: Direct file open

You can open `index.html` directly in your browser, though using a local server is recommended.

## How this first slide works

- It reveals each entity in **three steps** (index, title, description) with fade-in transitions.
- Use **Right Arrow** to move forward and **Left Arrow** to move backward through each reveal step.
- Use **Next/Previous** buttons, and clicking on the slide advances one step.

This keeps the narrative focused and avoids a splashy all-at-once visual.
