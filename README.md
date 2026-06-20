# Studio Kanban Prototype

A standalone HTML/CSS/JS demo prototype for a developer-centric kanban board with an integrated Kimchi AI agent.

## Features

- **Board view** — Kanban columns (Backlog, In Progress, Review, Closed) with repo tabs, workspace stats, and drag-and-drop
- **Kimchi agent chat** — Create and manage tasks via natural language commands
- **Task detail view** — Mini kanban sidebar, per-task agent chat, and a code diff / terminal / git history panel
- **Agent assignment** — Each task can be assigned to one of four agents (DP, ZU, RL, IS)

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

You can also open `index.html` directly in a browser, or use `python3 -m http.server`.

## Chat commands

| Command | Example |
|---------|---------|
| Create task | `create task: Fix login bug` |
| Add with agent | `add "Refactor API" to in-progress assign DP` |
| List tasks | `list tasks` |
| Move task | `move unify spot to review` |
| Help | `/help` |

Press `c` on the board to open the create-task modal.

## Files

- `index.html` — Structure for board and task detail views
- `styles.css` — Dark theme styling
- `app.js` — State, rendering, chat logic, drag-and-drop
