---
name: shortcuts
description: Builds keyboard, mouse-click, hover, scroll and form-input interactions with the @peter.naydenov/shortcuts library — context-based shortcut definitions, plugins (pluginKey, pluginClick, pluginHover, pluginScroll, pluginForm), per-context setup, notes, dependencies, custom events and workflows. Use this skill whenever code imports '@peter.naydenov/shortcuts', when the user asks to add hotkeys, key sequences, double-clicks, hover or scroll reactions, or form-field watchers to a web app that uses this library, when switching shortcut sets between screens, modals or app states, or when debugging a shortcut that does not fire.
---

# Shortcuts (@peter.naydenov/shortcuts)

The library turns DOM input into named events. Shortcut sets are grouped into **contexts**; only one context is active at a time, so switching screens or app states means switching contexts instead of adding and removing listeners. **Plugins** translate physical input into shortcut names (`key`, `click`, `hover`, `scroll`, `form`).

## Workflow

Follow these steps in order. Shortcuts only fire after step 4.

```js
import { shortcuts, pluginKey, pluginClick } from '@peter.naydenov/shortcuts'

const short = shortcuts ()                         // 1. Create an instance (one per app is typical)
short.enablePlugin ( pluginKey )                   // 2. Enable only the plugins you use
short.enablePlugin ( pluginClick, { mouseWait: 250 })  //    second argument = plugin options (app-wide defaults)
short.load ({                                      // 3. Load contexts: { contextName: { shortcutName: action | action[] } }
    editor : {
          'key: ctrl+s'   : ({ dependencies }) => dependencies.api.save ()
        , 'key: g,o'      : () => goTo ()          //    key sequence: g then o
        , 'click: left-2' : ({ target }) => edit ( target.dataset.click )
    }
  , modal  : {
          'key: esc'      : () => closeModal ()
    }
})
short.setDependencies ({ api })                    //    services available as data.dependencies in every action
short.changeContext ( 'editor' )                   // 4. Activate a context
```

Plugins and contexts can be enabled and loaded in any order; enabling a plugin normalizes the names already loaded.

## Shortcut names

A shortcut name is `'<plugin>: <description>'`. Case and spaces around `:` don't matter — the library normalizes names to upper case (`'key: shift+a'` becomes `'KEY:A+SHIFT'`).

| Plugin | Name examples | Fires when |
|---|---|---|
| key | `key: ctrl+s`, `key: shift+alt+f`, `key: g,o,t,o`, `key: esc`, `key: f2` | Key combination; `,` separates a sequence |
| click | `click: left-1`, `click: left-2`, `click: right-1-ctrl`, `click: middle-1` | Button + click count + optional modifiers, joined by `-` |
| hover | `hover: on`, `hover: off` | Pointer enters / leaves a hover target |
| scroll | `scroll: up`, `scroll: down`, `scroll: left`, `scroll: right`, `scroll: end` | Page scroll direction; `end` after scrolling stops |
| form | `form: watch`, `form: define`, `form: action` | Configuration functions, not events — see [references/plugins.md](references/plugins.md) |
| any plugin | `key: setup`, `click: setup`, ... | Runs when the context activates; returns options for this context |
| none | `@save`, `app:refresh`, `@shortcuts-error` | Custom event — fired only by `emit` (or the error channel) |

Modifiers are `ctrl`, `alt`, `shift` in any order. Special key names: `left`, `up`, `right`, `down`, `enter`, `esc`, `backspace`, `space`, `tab`, `f1`–`f12`, and the characters `` ` [ ] = / \ ``. Letters and digits are matched by physical key position, so `key: z` is the same physical key on every keyboard layout.

Click and hover need a **target**: the clicked element or its closest ancestor with a `data-click` (click) or `data-hover` (hover) attribute. Clicks on `<a href>` are targets too. Clicks with no target are ignored.

```html
<button data-click="save">Save</button>       <!-- data.target.dataset.click === 'save' -->
<div data-hover="menu">...</div>
```

## Action data

Every action receives one `data` object. Common fields: `context`, `note`, `dependencies` (includes `emit`), `options` (current plugin options), `viewport`, `type` (`'key'`, `'click'`, ...).

- **key**: `wait()`, `end()`, `ignore()`, `isWaiting()` — control key sequences
- **click**: `target`, `x`, `y`, `event`, `sizes`, `position`, `pagePosition`
- **hover**: `target`, `event`, `sizes`, `position`, `pagePosition`
- **scroll**: `x`, `y`, `direction`

Full field lists per plugin: [references/plugins.md](references/plugins.md).

## Contexts, notes and dependencies

- `changeContext ( name )` — activate a context; `changeContext ()` switches all shortcuts off. Use one context per screen, modal or mode, and switch on navigation or when a modal opens/closes.
- `setNote ( 'draft' )` — a sub-state inside the current context, read as `data.note`. Use it when the same keys should behave differently without duplicating a context.
- `setDependencies ({ api, router })` — merges services into `data.dependencies`. Prefer this over importing services into action functions; it keeps definitions testable and lets one definition object work with different services.

## Options: app-wide vs per context

- **App-wide**: `short.enablePlugin ( pluginKey, { keyWait: 600 })` sets the plugin defaults.
- **Per context**: a `'<plugin>: setup'` action returns overrides that apply only while that context is active. It receives `{ dependencies, defaults, options }`.

```js
game : {
      'key: setup'   : () => ({ keyWait: 200 })          // fast sequences only in the 'game' context
    , 'click: setup' : ({ defaults }) => ({ clickTarget: [ ...defaults.clickTarget, 'data-tile' ] })
    , 'key: a,b'     : () => combo ()
}
```

| Plugin | Options (defaults) |
|---|---|
| key | `keyWait` 480 ms, `streamKeys` function called on every key press |
| click | `mouseWait` 320 ms, `clickTarget` `['data-click','href']` |
| hover | `wait` 320 ms, `hoverTarget` `['data-hover']` |
| scroll | `scrollWait` 50 ms, `endScrollWait` 400 ms, `minSpace` 40 px |

## Custom events and workflows

Any name without a plugin prefix is a custom event. Trigger it from outside with `short.emit ( name, ...args )` or from inside an action with `data.dependencies.emit ( name, ...args )`. This decouples gestures from application logic: several gestures can emit the same `@event`, and one handler implements it.

```js
editor : {
      'key: ctrl+s'   : ({ dependencies }) => dependencies.emit ( '@save' )
    , 'click: left-1' : ({ target, dependencies }) => {
                            if ( target.dataset.click === 'save' )   dependencies.emit ( '@save' )
                        }
    , '@save'         : () => save ()
}
```

Prefix custom names with `@` or `app:` so they never collide with plugin names. Handlers fire only if they are defined in the **active** context.

## Common mistakes

- **Nothing fires** — check, in order: the plugin is enabled, a context is active (`short.getContext ()`), the name has the plugin prefix (`'key: ctrl+s'`, not `'ctrl+s'`), and click/hover elements carry a target attribute.
- **Single click feels slow** — defining `click: left-2` makes `click: left-1` wait `mouseWait` ms for a possible second click. Add `data-quick-click` to elements that never need double clicks, or lower `mouseWait` in `click: setup` for that context.
- **Single key reacts with a delay** — with `key: g` and `key: g,o` in the same context, the library waits `keyWait` ms after `g` to see if `o` follows. Keep sequences in contexts where that delay is acceptable, or lower `keyWait` in `key: setup`.
- **`pause` / `resume` / `emit` with a plugin shortcut** — pass the prefixed name (`short.pause ( 'key: ctrl+s' )`). `short.pause ()` pauses everything in the active context.
- **Errors are not thrown** — a missing context or an invalid `unload` publishes a message on the `@shortcuts-error` event (renamed with `shortcuts({ errorEventName })`). Add `'@shortcuts-error': msg => console.warn ( msg )` to a context to see them while it is active.
- **`reset()`** destroys plugins, unloads all contexts and clears dependencies and `onShortcut`. Re-enable plugins and reload after it.
- **Form elements must exist when the context activates** — `form: watch` runs at activation. After rendering new form fields, reactivate the context: `short.changeContext (); short.changeContext ( name )`.

## Logging

`shortcuts ({ onShortcut: ( shortcutName, ...args ) => ... })` is called for every fired shortcut with the normalized name and the arguments the actions received. Use it for debugging and analytics.

## TypeScript

Types ship with the package. `short.load ()` infers `data` for each action from its shortcut name — `'key: ...'` gets `KeyEventData`, `'click: ...'` gets `ClickEventData`, setup actions must return valid plugin options. Import types when annotating handlers defined outside `load`:

```ts
import type { ClickEventData, ShortcutsAPI, FormAction } from '@peter.naydenov/shortcuts'
const onTile = ({ target }: ClickEventData) => select ( target.dataset.click )
```

## References

- [references/plugins.md](references/plugins.md) — read when writing shortcuts for a specific plugin: full syntax, target rules, action data fields, and the form plugin (`watch` / `define` / `action`).
- [references/api.md](references/api.md) — read when you need exact method signatures, return values or error behavior.
- [references/recipes.md](references/recipes.md) — read when designing contexts for a real app: modal stacks, SPA routes, key sequences with `wait()`, form autosave.
