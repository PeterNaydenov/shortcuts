# Agent notes — git-shortcuts

## Graphify
A graph of this codebase has been built. Artifacts live in `graphify-out/`:

- `graphify-out/GRAPH_REPORT.md` — textual audit (god-nodes, surprising edges, sample questions)
- `graphify-out/graph.html` — interactive vis.js visualization (open in browser, search + click-to-inspect)
- `graphify-out/graph.json` — raw graph data
- `graphify-out/manifest.json` — file mtimes (used by `graphify --update`)
- `graphify-out/cost.json` — cumulative token spend
- `graphify-out/cache/` — semantic cache (speeds up re-extraction)
- `graphify-out/.graphify_benchmark.json` — per-question token reduction stats

### How to use the graph
- **Browser:** open `graphify-out/graph.html`
- **Ask the agent:** request queries like "find edges between key plugin and form plugin" or "what are the top 5 god-nodes in community C17"
- **Python directly:** the venv interpreter is pinned at `graphify-out/.graphify_python`. Example:
  ```
  $(cat graphify-out/.graphify_python) -c "
  import json
  from networkx.readwrite import json_graph
  G = json_graph.node_link_graph(json.loads(open('graphify-out/graph.json').read()), edges='links')
  print([n for n in G.neighbors('main_main')])
  "
  ```

### Re-running graphify
- Full: invoke `/graphify` again
- Incremental: `graphify --update` (uses `manifest.json` to re-extract only changed files)
- Cache hit means code files won't be re-processed; only changed files get re-extracted

### Known limitations of the current graph
- Built from AST + cached code semantic only. The 32 subagent extractions for docs (README, API, Changelog, Migration guide, etc.) and 58 images were dispatched but **their outputs were never persisted to disk** before the run was truncated. The graph is strong on structural edges (imports, calls, containment) but weak on prose meaning.
- 60 communities is inflated by the minified test bundle `html/assets/index-DOkKC3NI.js`. The meaningful source-code communities are C17 (plugins), C18 (sorter), C21 (prettifier), C28 (block nav), C35–C48 (test helpers + public API), C49–C59 (configs + test files).
- Token reduction: 5.2x (106,545 corpus → ~20,658 per query). See `.graphify_benchmark.json`.

### Staleness
The graph reflects the code as of last `/graphify` run. If files change, the graph goes stale — re-run `/graphify` or `graphify --update` to refresh.

## v4.1.0 architecture: `data.dependencies.emit`
The 4.1.0 release moves the `emit` function off the event-data top level and onto `data.dependencies`:

- `src/main.js:116-118` initializes `dependencies.extra = { emit: ev.emit }` so every plugin's `data.dependencies` carries the library's emitter by default.
- `src/main.js:238` (the `API.emit` synthetic event) passes `data = { dependencies: dependencies.extra }`.
- Each plugin's `_listenDOM.js` sets `dependencies: extra` (or `extra` destructured from `dependencies`) — no top-level `emit` field on event data.
- `src/main.js:273-280` (the `API.reset()` function) re-affirms the default: `dependencies.extra = { emit: ev.emit }` (NOT `{}`), so plugins enabled after a `reset()` still get `data.dependencies.emit`.
- User actions call `data.dependencies.emit(eventName, ...args)`. Custom keys still flow into `data.dependencies` via `setDependencies({...})` (merged, not replaced).
- Tests verify at least these places still work:
  - `test/02-key.test.js:475, 495` — `captured.dependencies.emit` exists, used for workflow
  - `test/03-click.test.js:598, 621` — same
  - `test/04-form.test.js:329` — same
  - `test/05-hover.test.js:463, 486` — same
  - `test/06-scroll.test.js:376` — same
  - `test/01-general.test.js:215` — `short.emit('yo', { ... })` (public API, still works with the new data shape because variadic args pass through to listeners as positional args)
