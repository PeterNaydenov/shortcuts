# Graph Report - src  (2026-06-07)

## Corpus Check
- Corpus is ~10,802 words - fits in a single context window. You may not need a graph.

## Summary
- 39 nodes · 26 edges · 17 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Plugin entry points (index.js)"
Cohesion: 0.25
Nodes (0): 

### Community 1 - "Library main entry (main.js)"
Cohesion: 1.0
Nodes (0): 

### Community 2 - "listShortcuts method"
Cohesion: 1.0
Nodes (0): 

### Community 3 - "unload method"
Cohesion: 1.0
Nodes (0): 

### Community 4 - "_readShortcutWithPlugins helper"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "_normalizeWithPlugins helper"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "load method"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "_setupPlugin (plugin factory core)"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "_systemAction helper"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "changeContext method"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "_registerShortcutEvents (per-plugin event glue)"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "_normalizeShortcutName (per-plugin)"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "_findTarget (hover only)"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "_readClickEvent (click only)"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "_specialChars (key only)"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "_readKeyEvent (key only)"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "_defaults (form only)"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Library main entry (main.js)`** (2 nodes): `main.js`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `listShortcuts method`** (2 nodes): `listShortcuts.js`, `listShortcuts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `unload method`** (2 nodes): `unload.js`, `unload()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_readShortcutWithPlugins helper`** (2 nodes): `_readShortcutWithPlugins.js`, `_readShortcutWithPlugins()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_normalizeWithPlugins helper`** (2 nodes): `_normalizeWithPlugins.js`, `_normalizeWithPlugins()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `load method`** (2 nodes): `load.js`, `load()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_setupPlugin (plugin factory core)`** (2 nodes): `_setupPlugin.js`, `_setupPlugin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_systemAction helper`** (2 nodes): `_systemAction.js`, `_systemAction()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `changeContext method`** (2 nodes): `changeContext.js`, `changeContext()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_registerShortcutEvents (per-plugin event glue)`** (2 nodes): `_registerShortcutEvents.js`, `_registerShortcutEvents()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_normalizeShortcutName (per-plugin)`** (2 nodes): `_normalizeShortcutName.js`, `_normalizeShortcutName()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_findTarget (hover only)`** (2 nodes): `_findTarget.js`, `_findTarget()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_readClickEvent (click only)`** (2 nodes): `_readClickEvent.js`, `_readClickEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_specialChars (key only)`** (2 nodes): `_specialChars.js`, `_specialChars()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_readKeyEvent (key only)`** (2 nodes): `_readKeyEvent.js`, `_readKeyEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_defaults (form only)`** (1 nodes): `_defaults.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._