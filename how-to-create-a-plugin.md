# How to Create a Plugin for @peter.naydenov/shortcuts

> Audience: developers building a custom input source for the shortcuts library (touch gestures, gamepad, MIDI, custom DOM events, etc.).

This guide walks through the structure of a plugin. It assumes you are already familiar with [README.md](./README.md) — the public API, context/note model, action functions, and `data.dependencies.emit`.

The source code in `src/plugins/` is the canonical reference. The five shipped plugins (`key`, `click`, `hover`, `scroll`, `form`) follow the exact same contract. If you follow that contract, your plugin drops in alongside them with no changes to the core library.



## Table of Contents
1. [Mental Model](#mental-model)
2. [The Plugin Contract in 60 Seconds](#the-plugin-contract-in-60-seconds)
3. [The Plugin File Layout](#the-plugin-file-layout)
4. [Step-by-Step: A Minimal `pluginGamepad`](#step-by-step-a-minimal-plugingamepad)
5. [What `setupPlugin` injects into your pluginState](#what-setupplugin-injects-into-your-pluginstate)
6. [What `setupPlugin` injects into your `dependencies`](#what-setupplugin-injects-into-your-dependencies)
7. [The `data` object: what to put in it](#the-data-object-what-to-put-in-it)
8. [The `PREFIX:SETUP` per-context event](#the-prefixsetup-per-context-event)
9. [Naming shortcuts and the normalization rules](#naming-shortcuts-and-the-normalization-rules)
10. [Listening to the DOM safely](#listening-to-the-dom-safely)
11. [Reset, mute, unmute, destroy](#reset-mute-unmute-destroy)
12. [Distributing your plugin](#distributing-your-plugin)
13. [Full checklist](#full-checklist)
14. [Appendix: the shipped plugins at a glance](#appendix-the-shipped-plugins-at-a-glance)



## Mental Model

A plugin is the layer that turns a **physical input** (keystroke, mouse click, scroll, hover, form change, …) into a **shortcut event** in the library's internal event emitter. Everything else — contexts, notes, action functions, `data.dependencies.emit`, pause/resume, mute/unmute — is the same for every plugin.

Your plugin has four jobs:

1. **Match** a shortcut name to your input family. (`'key:s+alt'` belongs to the `key` plugin, `'gamepad:a+start'` would belong to a `gamepad` plugin.)
2. **Normalize** the name the user wrote so that `'key:alt+s'` and `'key:s+alt'` are the same.
3. **Register** the user's shortcuts in the current context, including their `PREFIX:setup` options.
4. **Listen** to the DOM (or the device API) and emit a normalized event with a `data` payload.

The library takes care of the rest: switching contexts, muting the whole plugin, pausing individual shortcuts, error reporting, and exposing your events to `shortcuts.emit()`.



## The Plugin Contract in 60 Seconds

A plugin is **one function** that returns a frozen API. The function receives `setupPlugin` (provided by the core library) plus the user's `options`. You call `setupPlugin(...)` with six things and you get back a `pluginAPI` you can attach to the instance.

```js
// src/plugins/myplugin/index.js
function pluginMy ( setupPlugin, options = {} ) {
    const
          deps        = { resetState, regex: /MY\s*\:/i /*, helpers… */ }
        , pluginState = { defaultOptions: {…}, listenOptions: {…}, /* state vars… */ }
        ;

    return setupPlugin ({
              prefix               : 'my'                              // (1) one-word tag for shortcut names
            , _normalizeShortcutName                                    // (2) parse user-written names into canonical form
            , _registerShortcutEvents                                   // (3) walk the active context, apply PREFIX:setup, count shortcuts
            , _listenDOM                                                // (4) attach/detach DOM listeners; returns { start, stop }
            , pluginState                                                // (5) mutable per-plugin state; core injects 4 fields into it
            , deps                                                       // (6) helpers + resetState; spread into the dependencies your listeners receive
        });
} // pluginMy

export default pluginMy
```

That's the whole thing. The shipped plugins are 60-70 lines each.



## The Plugin File Layout

Every shipped plugin uses the same directory layout. You can use one file, but splitting them makes maintenance easier and matches the rest of the codebase.

```
src/plugins/my/
├── index.js                     // plugin factory (this is the only file required for import)
├── _normalizeShortcutName.js    // (2) name normalization
├── _registerShortcutEvents.js   // (3) per-context setup
├── _listenDOM.js                // (4) DOM listeners
└── _optional helpers…           // anything else you want in deps
```

Conventions:
- Files starting with `_` are private to the plugin.
- The factory in `index.js` is the only thing you `export default`. It will be passed to `short.enablePlugin(pluginMy)`.
- Use `'use strict'` and ES module `import` syntax (the library ships ESM + CJS via a build).



## Step-by-Step: A Minimal `pluginGamepad`

Below is a complete, working example for a hypothetical gamepad plugin. It illustrates every part of the contract without the historical noise of the shipped plugins. After this section, the rest of the guide documents the contract in detail.

### 1. The factory

```js
// src/plugins/gamepad/index.js
'use strict'

import _normalizeShortcutName  from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _listenDOM              from './_listenDOM.js'

function pluginGamepad ( setupPlugin, options = {} ) {
    const
          pluginState = {
                active        : false
              , buffer        : []          // accumulating button presses in a sequence
              , defaultOptions: {
                      gamepadWait : 600     // ms between buttons in a sequence
                }
              , listenOptions : {
                      gamepadWait : 600
                }
              , ...(options || {})          // user overrides go straight into state
            }
        , deps = {
                regex     : /GAMEPAD\s*\:/i
              , resetState: function () {
                    pluginState.active = false
                    pluginState.buffer  = []
                }
            }
        ;

    return setupPlugin ({
              prefix               : 'gamepad'
            , _normalizeShortcutName
            , _registerShortcutEvents
            , _listenDOM
            , pluginState
            , deps
        });
}

export default pluginGamepad
```

### 2. Normalize a shortcut name

`_normalizeShortcutName(name)` is called for **every** shortcut name across **every** context, by every plugin. Each plugin is responsible for recognizing its own prefix and returning the canonical form (or returning `name` unchanged if it doesn't belong to you).

```js
// src/plugins/gamepad/_normalizeShortcutName.js
'use strict'

function _normalizeShortcutName ( name ) {
    const upper = name.toUpperCase()
    if ( !/GAMEPAD\s*\:/i.test(upper) ) return name       // not ours — pass through
    if ( upper.includes('SETUP') )       return 'GAMEPAD:SETUP'

    // Format: GAMEPAD:A+B,LEFT    (commas separate sequence steps, + joins modifiers)
    const body  = upper.slice(upper.indexOf(':') + 1)
    const steps = body.split(',').map( step =>
        step.split('+').map( s => s.trim() ).sort().join('+')
    )
    return `GAMEPAD:${steps.join(',')}`
}

export default _normalizeShortcutName
```

**Rules of thumb:**
- The returned name **must** start with `PREFIX:` (uppercase prefix).
- Modifiers should be alphabetized (`shift+ctrl` not `ctrl+shift`) so the same shortcut always normalizes the same way.
- Return `'PREFIX:SETUP'` (uppercase) when the user wrote a setup event.
- Return `name` unchanged when it doesn't match your prefix.

### 3. Register shortcuts in the active context

`_registerShortcutEvents(deps, pluginState)` is called by the core every time the context changes. It walks the current context's shortcuts, applies the user's `PREFIX:setup` (if any), and returns the count of shortcuts that match this plugin. If the count is zero, the core will not call `listener.start()` — you don't have to guard against empty state yourself.

```js
// src/plugins/gamepad/_registerShortcutEvents.js
'use strict'

function _registerShortcutEvents ( deps, pluginState ) {
    const
          { regex }                    = deps
        , { currentContext, shortcuts
          , defaultOptions, listenOptions
          } = pluginState
        ;

    if ( currentContext.name == null ) return 0

    let count = 0
    let hasSetup = false

    Object.entries( shortcuts[currentContext.name] ).forEach( ([name, list]) => {
        if ( !regex.test(name) ) return                                       // not ours

        if ( name === 'GAMEPAD:SETUP' ) {
            hasSetup = true
            // Each user's setup fn receives { dependencies, defaults, options }
            // and returns a partial options object we merge into listenOptions.
            const update = list.reduce( (res, fn) => {
                const r = fn({
                      dependencies : deps.extra
                    , defaults     : structuredClone(defaultOptions)
                    , options      : listenOptions
                })
                return Object.assign(res, r)
            }, defaultOptions)
            Object.assign( listenOptions, update )
            return
        }

        count++
    })

    if ( !hasSetup ) Object.assign( listenOptions, defaultOptions )
    return count
}

export default _registerShortcutEvents
```

**Contract summary:**
- Walk `pluginState.shortcuts[ pluginState.currentContext.name ]`.
- Skip entries that don't match your `deps.regex`.
- If you see `'PREFIX:SETUP'`, call each handler with `{ dependencies, defaults, options }` and merge the returned object into `pluginState.listenOptions`.
- If the context has **no** setup event, copy `defaultOptions` into `listenOptions` so they're always populated.
- Return the count of registered shortcuts.

### 4. Listen to the device

`_listenDOM(deps, pluginState)` is called once at enable time and once on every context change (after the register step). It must return `{ start, stop }`. The core will call `start()` to begin listening and `stop()` to pause.

```js
// src/plugins/gamepad/_listenDOM.js
'use strict'

function _listenDOM ( deps, pluginState ) {
    const { ev, extra } = deps
    const { listenOptions, currentContext } = pluginState

    function onGamepadEvent ( e ) {
        // Build a canonical "GAMEPAD:A+B,LEFT" string from the device
        const name = `GAMEPAD:${e.buttons.sort().join('+')}`

        const data = {
              type          : 'gamepad'
            , context       : currentContext.name
            , note          : currentContext.note
            , dependencies  : extra
            , event         : e
            , options       : listenOptions
        }

        ev.emit( name, data )   // core + user listeners receive the event
    }

    function start () {
        if ( pluginState.active ) return
        window.addEventListener( 'gamepadbuttondown', onGamepadEvent )
        pluginState.active = true
    }

    function stop () {
        if ( !pluginState.active ) return
        window.removeEventListener( 'gamepadbuttondown', onGamepadEvent )
        pluginState.active = false
        pluginState.buffer = []           // clear any in-flight state
    }

    return { start, stop }
}

export default _listenDOM
```

**Contract summary:**
- Return `{ start, stop }`.
- `start()` adds your event listeners, sets `pluginState.active = true`. Must be idempotent (early return if already active).
- `stop()` removes listeners, sets `pluginState.active = false`, clears any pending timers. Must be idempotent.
- Inside your listeners, build a `data` object (see [next section](#the-data-object-what-to-put-in-it)) and call `ev.emit('PREFIX:EVENT_NAME', data)`.
- The `PREFIX` part of the emitted name must be uppercase.

### 5. Wire it up

```js
import { shortcuts, pluginGamepad } from '@my-scope/shortcut-plugin-gamepad'

const short = shortcuts()
short.enablePlugin( pluginGamepad )

short.load({
    game: {
        'gamepad:setup': ({ defaults }) => ({ gamepadWait: 300 }),
        'gamepad: a, b, start': () => console.log('Combo A → B → Start')
    }
})

short.changeContext('game')
```

That's the full plugin. Drop the four files into your package, add it to your app, and the rest of the library (`pause`/`resume`, `mute`/`unmute`, `reset`, `getDependencies`, …) works for your input source with no extra code.



## What `setupPlugin` injects into your pluginState

`setupPlugin` (provided by the core) **augments your `pluginState` object** with four references from the library before calling your `_registerShortcutEvents` and `_listenDOM`. Treat them as read-only unless you know what you're doing.

| Field | Type | What it is |
|---|---|---|
| `currentContext` | `{ name: string \| null, note: string \| null }` | The live context descriptor. `name` is `null` when no context is active. |
| `shortcuts` | `object` | The full shortcuts registry: `{ contextName: { shortcutName: [fn, …] } }`. Reading from it is fine. Mutating it can desync the library. |
| `exposeShortcut` | `function \| false` | The user's `onShortcut` constructor option, or `false` if they didn't set one. The core wires this up to fire on every emitted event. |
| `ERROR_EVENT_NAME` | `string` | The configured error event name (default `'@shortcuts-error'`). Emit here with `ev.emit(ERROR_EVENT_NAME, 'message')`. |

The core **also overrides** these four on your state when the context changes:

```js
pluginState.currentContext   // updated to the new context descriptor
pluginState.shortcuts        // same reference, content may have changed via load/unload
pluginState.exposeShortcut   // only set once at enable
pluginState.ERROR_EVENT_NAME // only set once at enable
```

You don't need to read or write any of them — but you can use `currentContext.name` and `currentContext.note` in your `data` payload (the library's other plugins do).



## What `setupPlugin` injects into your `dependencies`

`setupPlugin` spreads your `deps` and adds two library-owned fields. Your `_registerShortcutEvents` and `_listenDOM` receive the merged object as their first argument.

| Field | Type | What it is |
|---|---|---|
| `ev` | `object` | The library's event emitter ([`@peter.naydenov/notice`](https://github.com/PeterNaydenov/notice)). Has `.emit(name, …args)`, `.on(name, fn)`, `.off(name, fn)`, `.reset()`, `.start(name)`, `.stop(name)`. |
| `extra` | `object` | The bag the user registered via `shortcuts.setDependencies({…})`. Pass this through into your `data.dependencies` so user action functions can read it. |
| `…your deps` | | Everything you put in your `deps` object — `resetState`, `regex`, helper functions, etc. |

The `regex` field is conventional but not enforced. The library uses it to identify your shortcuts in `_registerShortcutEvents`. Pick a regex that matches your `PREFIX:` exactly (case-insensitive with whitespace tolerance) and nothing else.



## The `data` object: what to put in it

The second argument to `ev.emit('PREFIX:NAME', data)` is the object every user action function receives. The contract is not enforced, but staying close to what the shipped plugins do makes your plugin feel native to users.

**Always include:**
- `type` — your plugin name as a string (e.g. `'key'`, `'click'`, `'gamepad'`). Used internally to tag the event.
- `context` — `pluginState.currentContext.name` at emit time.
- `note` — `pluginState.currentContext.note` (or `null`).
- `dependencies` — `deps.extra`. The library bakes `emit: ev.emit` into `extra` by default, so users get `data.dependencies.emit(eventName, ...args)` for free. Anything the host app adds via `setDependencies({...})` is merged into the same bag, so users can also call `data.dependencies.api.foo()` from their action.
- `options` — `pluginState.listenOptions` (the live options for the active context).

**Include when relevant:**
- `target` — the DOM element the event came from.
- `event` — the raw DOM/device event.
- `x` / `y` / `viewport` — coordinate data, mirroring the shipped `click`/`hover` plugins.
- `wait` / `end` / `ignore` / `isWaiting` — only meaningful for sequence-style plugins like `key`.

**Avoid putting:**
- Plugin-internal state (timers, buffers, etc.). Users will see it and rely on it, locking you in.
- The full `ev` object. The library already exposes `ev.emit` to user actions via `data.dependencies.emit` (it bakes `emit: ev.emit` into `extra` for you). Do not add a top-level `emit` field of your own — duplicating it will only confuse readers and break if the library's wrapping changes.



## The `PREFIX:SETUP` per-context event

A `PREFIX:setup` event inside a context is the user's way to override your plugin's defaults **for that context only**. It's the preferred customization mechanism — see [README → Per-Context Setup vs `enablePlugin` Options](./README.md#per-context-setup-vs-enableplugin-options).

Your plugin must support it in `_registerShortcutEvents`. The pattern is:

```js
if ( shortcutName === 'PREFIX:SETUP' ) {
    const update = list.reduce( (res, fn) => {
        const r = fn({
              dependencies : deps.extra                            // user-set deps
            , defaults     : structuredClone(pluginState.defaultOptions)  // clone — never mutate
            , options      : pluginState.listenOptions             // live ref to per-context options
        })
        return Object.assign(res, r)                               // shallow merge into res
    }, pluginState.defaultOptions)                                 // initial value = defaults

    Object.assign(pluginState.listenOptions, update)               // final write to listenOptions
    return
}
```

**Key invariants:**
- The user gets `defaults` (a fresh `structuredClone` of your `defaultOptions`) and `options` (the live `listenOptions`). They may return a partial object with only the keys they want to override.
- The returned object is shallow-merged first across all setup functions (so order matters if the user defines multiple `PREFIX:setup` handlers), then into `listenOptions`.
- If the context does **not** define a `PREFIX:setup`, copy `defaultOptions` into `listenOptions` so they're always populated. Otherwise downstream code may read `undefined` options.

> The `form` plugin handles this slightly differently because it does not have per-action options — it returns the `defaults` object unchanged when no setup is provided. The `key`/`click`/`hover`/`scroll` plugins follow the pattern above.



## Naming shortcuts and the normalization rules

A user writes shortcut names like:

```js
'key: ctrl+s'        // 'key' is the prefix; 'ctrl+s' is the body
'click: left-2-ctrl' // 'click' prefix; 'left-2-ctrl' body
'form:action'        // 'form' prefix; one of the form lifecycle events
```

After your `_normalizeShortcutName` runs, the names look like:

```js
'KEY:CTRL+S'
'CLICK:CTRL-LEFT-2'   // modifiers alphabetized, button+count first
'FORM:ACTION'
```

**Rules:**
- Normalization runs at `load()` time on **every** shortcut name in **every** context — not just the active one. This is so that `shortcuts.emit('KEY:CTRL+S')` (with any spelling) matches.
- Each plugin receives every name. Yours must return the input unchanged when it doesn't match your prefix.
- Modifiers should be sorted alphabetically (`ctrl+shift+s`, not `shift+ctrl+s`).
- Always uppercase your prefix and the parts that should be uppercase. Lowercase parts (e.g. raw key names) are kept as the user wrote them.
- Return `'PREFIX:SETUP'` (uppercase) for the setup event, no matter how the user wrote it.



## Listening to the DOM safely

A few rules the shipped plugins follow — copy them.

**Idempotency.** `start()` and `stop()` can be called multiple times. Use `pluginState.active` as a guard:

```js
function start () {
    if ( pluginState.active ) return
    document.addEventListener( '…', handler )
    pluginState.active = true
}

function stop () {
    if ( !pluginState.active ) return
    document.removeEventListener( '…', handler )
    pluginState.active = false
    clearTimeout( timer )           // clear any pending timers
    timer = null
}
```

**Clear timers in `stop`.** Any `setTimeout` / `setInterval` you start inside your listeners must be cleared in `stop()`, otherwise a muted plugin will still fire late. The shipped plugins use a `pluginState.wait[ type ]` for per-type throttles — a plain object on state is fine.

**Don't read from `window` at module load.** Reading `window.innerWidth` at import time breaks SSR and tests. Read inside the listener / inside `start()`.

**Don't attach global listeners that fire when the user is typing in an input.** The shipped plugins don't filter for this, but it's good practice to add an `isContentEditable` check or look at `event.target` if your plugin would conflict with text input. The `form` plugin only attaches to focus and input events, so it doesn't have this concern.

**Cleanup in `resetState`.** Add a `resetState` function to your `deps` that resets everything in `pluginState` to its initial values. The core calls it on every `contextChange` (see [below](#reset-mute-unmute-destroy)).



## Reset, mute, unmute, destroy

The core calls these four methods on your returned `pluginAPI` (which is what `setupPlugin` constructs for you). You don't write them — `setupPlugin` writes them based on your `deps.resetState` and your `_listenDOM`'s `{start, stop}`.

| Method | When the core calls it | What it does |
|---|---|---|
| `resetState()` (your `deps`) | On every `contextChange`, on `mute`/`unmute` cycles if you choose, and on `destroy` | Resets your `pluginState` to its initial shape. **You write this.** It typically zeroes counters, clears buffers, and may also re-run defaults into `listenOptions`. |
| `pluginAPI.mute()` | `short.mutePlugin('prefix')` | Calls your `listener.stop()`. Your `resetState` is **not** called. |
| `pluginAPI.unmute()` | `short.unmutePlugin('prefix')` | Calls your `listener.start()`. |
| `pluginAPI.destroy()` | `short.disablePlugin('prefix')` or `short.reset()` | Calls your `listener.stop()` **and** your `resetState()`. After this, the plugin is gone. To bring it back, call `enablePlugin` again. |
| `pluginAPI.contextChange()` | Every `short.changeContext(name)` | Calls your `resetState()`, then re-runs `_registerShortcutEvents`, then either `listener.stop()` or `listener.start()` depending on the count. **Your listeners are re-attached** so any new `PREFIX:setup` options in the new context take effect. |
| `pluginAPI.shortcutName(name)` | `shortcuts.emit(name, …)` | Calls your `_normalizeShortcutName` so the user can pass any spelling. |
| `pluginAPI.getPrefix()` | `short.listPlugins()` | Returns your `prefix` string. |

**You write `resetState`.** Keep it focused: clear timers, clear buffers, reset any counters. Don't reset `defaultOptions` / `listenOptions` — those are managed by the core.

```js
// inside pluginMy / index.js
function resetState () {
    pluginState.active = false
    pluginState.buffer = []
    clearTimeout( pluginState.timer )
    pluginState.timer = null
}
deps.resetState = resetState
```



## Distributing your plugin

A plugin is just a function. You can publish it as a normal npm package and the consumer does:

```js
import { shortcuts } from '@peter.naydenov/shortcuts'
import { pluginGamepad } from '@my-scope/shortcut-plugin-gamepad'

const short = shortcuts()
short.enablePlugin( pluginGamepad )
```

Recommended package layout:

```
shortcut-plugin-gamepad/
├── package.json
│   ├── name:        '@my-scope/shortcut-plugin-gamepad'
│   ├── main:        'dist/index.cjs'
│   ├── module:      'dist/index.js'
│   ├── types:       'dist/index.d.ts'
│   └── peerDependencies: { '@peter.naydenov/shortcuts': '^4.1.0' }
├── src/
│   └── plugins/gamepad/   // the files from this guide
├── dist/                  // build output
└── README.md              // document your prefix, options, action-function `data` shape
```

**Document for your users:**
1. The prefix (`gamepad`).
2. The `data` shape they receive in action functions (a TypeScript `type` is best).
3. The `PREFIX:setup` options and their defaults.
4. The shortcut name syntax (how to combine buttons, modifiers, sequences).
5. Any browser/device support caveats.



## Full checklist

Before publishing your plugin, verify each item.

**Contract**
- [ ] Factory is `(setupPlugin, options = {})` and returns the result of `setupPlugin({…})`.
- [ ] All six fields are passed to `setupPlugin`: `prefix`, `_normalizeShortcutName`, `_registerShortcutEvents`, `_listenDOM`, `pluginState`, `deps`.
- [ ] `pluginState` has `defaultOptions` and `listenOptions` (initialized from the same object).
- [ ] `deps.resetState` is defined and resets only mutable runtime state.
- [ ] `deps.regex` matches your prefix case-insensitively with optional whitespace.

**Naming**
- [ ] `_normalizeShortcutName` returns input unchanged when the prefix doesn't match.
- [ ] `_normalizeShortcutName` returns `'PREFIX:SETUP'` for any setup spelling.
- [ ] Normalized names are uppercase, modifier-sorted, sequence-aware.

**Registration**
- [ ] `_registerShortcutEvents` handles `PREFIX:SETUP` correctly: passes `{dependencies, defaults, options}` to each handler, merges all returned objects, applies to `listenOptions`.
- [ ] When no setup is defined, `defaultOptions` are copied into `listenOptions`.
- [ ] Returns the count of registered shortcuts for the active context.

**Listening**
- [ ] `_listenDOM` returns `{ start, stop }`.
- [ ] `start()` and `stop()` are idempotent.
- [ ] All timers/intervals are cleared in `stop()`.
- [ ] `pluginState.active` is set in `start()` and cleared in `stop()`.
- [ ] Emitted events have a `data` object that includes `type`, `context`, `note`, `dependencies`, `options`. (`emit` is already provided by the library via `data.dependencies.emit` — no need to add it yourself.)

**Behavior**
- [ ] `mutePlugin` stops the listener; `unmutePlugin` restarts it.
- [ ] `disablePlugin` / `reset` triggers `resetState`.
- [ ] `changeContext` re-registers and re-attaches the listener.

**Distribution**
- [ ] Package peer-depends on `@peter.naydenov/shortcuts`.
- [ ] README documents the `data` shape, options, and shortcut syntax.



## Appendix: the shipped plugins at a glance

| Plugin | Prefix | Regex | Default options | Sequence? | Per-action `data` extras |
|---|---|---|---|---|---|
| `key` | `key` | `/KEY\s*:/i` | `keyWait: 480` | yes (`,` separator) | `wait`/`end`/`ignore`/`isWaiting`, `viewport` |
| `click` | `click` | `/CLICK\s*:/i` | `mouseWait: 320`, `clickTarget: ['data-click','href']` | no | `target`, `x`, `y`, `event` |
| `hover` | `hover` | `/HOVER\s*:/i` | `wait: 320`, `hoverTarget: ['data-hover']` | no | `target`, `x`, `y`, `event` |
| `scroll` | `scroll` | `/SCROLL\s*:/i` | `scrollWait: 50`, `endScrollWait: 400`, `minSpace: 40` | no | `event` |
| `form` | `form` | `/FORM\s*:/i` | (none) | no | `target`, `type`/`timing`/`wait`, `viewport`, `position`, `sizes`, `pagePosition` |

**The `form` plugin is the most different.** It does not have per-action `defaultOptions` (the wait is per-type, configured by the user's `form:action` return). Its `_registerShortcutEvents` reads `form:watch`, `form:define`, and `form:action` from the context and wires them up internally. If your plugin needs a multi-handler lifecycle, study `src/plugins/form/` for the closest pattern.

**The `key` plugin is the closest template for any "sequence of inputs"** — e.g. chord detection on a gamepad, multi-step voice commands, gesture sequences. Its `wait`/`end`/`ignore` helpers are documented in README under [Action Functions → Keyboard Action Functions](./README.md#keyboard-action-functions).
