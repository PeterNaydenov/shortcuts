# Plugin reference

## Contents
- [key](#key)
- [click](#click)
- [hover](#hover)
- [scroll](#scroll)
- [form](#form)
- [Setup actions](#setup-actions)

Every plugin exposes the same common fields in action data: `context` (string), `note` (string | null), `dependencies` (dependency bag with `emit`), `options` (plugin options for the current context), and `type` (plugin name). Most also include `viewport` — `{ X, Y, width, height }` with page scroll and window size.



## key

```js
import { pluginKey } from '@peter.naydenov/shortcuts'
short.enablePlugin ( pluginKey, { keyWait: 480, streamKeys: ({ key, context, note, dependencies }) => {} })
```

**Names**
- Combination: modifiers and one key joined by `+`, any order — `key: ctrl+shift+k` equals `key: k+shift+ctrl`.
- Sequence: steps separated by `,`, order matters — `key: g,i` (g then i), `key: ctrl+k,ctrl+c`.
- Modifiers: `ctrl`, `alt`, `shift`. The Meta/Cmd key is not a modifier.
- Special keys: `left`, `up`, `right`, `down`, `enter`, `esc`, `backspace`, `space`, `tab`, `f1`–`f12`, `` ` ``, `[`, `]`, `=`, `/`, `\`.
- Letters and digits use the physical key (`KeyboardEvent.code`), independent of keyboard layout.

**Timing**: a sequence ends when no key arrives within `keyWait` ms (default 480), or immediately when it reaches the longest sequence defined in the context.

**Action data (`KeyEventData`)**
| Field | Description |
|---|---|
| `wait()` | Stop the sequence timer. Every following key press fires its own event until `end()` — use for modes like "type a number after `g`" |
| `end()` | Restore the sequence timer |
| `ignore()` | Remove the last key from the current sequence |
| `isWaiting()` | True between `wait()` and `end()` |
| `context`, `note`, `dependencies`, `options`, `viewport`, `type: 'key'` | Common fields |

**`streamKeys`**: called on every key press with `{ key, context, note, dependencies }`. Set it app-wide in `enablePlugin` options, or per context from `key: setup` (`streamKeys: false` switches it off for that context).



## click

```js
import { pluginClick } from '@peter.naydenov/shortcuts'
short.enablePlugin ( pluginClick, { mouseWait: 320, clickTarget: [ 'data-click', 'href' ] })
```

**Names**: `click: <button>-<count>[-<modifier>...]`
- Button: `left`, `middle`, `right`. Count: number of clicks (1, 2, 3...).
- Modifiers `ctrl`, `alt`, `shift`, joined with `-`, any order — `click: left-1-ctrl-shift` equals `click: shift-left-1-ctrl`.

**Targets**: the clicked element or its closest ancestor having one of the `clickTarget` attributes. Clicks without a target are ignored. `<a>` elements and elements with `data-quick-click` never wait for a second click. A click on `<a href>` still runs the browser default — call `event.preventDefault()` in the action to stop navigation.

**Timing**: when the context defines multi-click shortcuts, a click waits `mouseWait` ms (default 320) for more clicks before firing.

**Action data (`ClickEventData`)**
| Field | Description |
|---|---|
| `target` | Target element |
| `x`, `y` | Click coordinates (clientX / clientY) |
| `event` | Original `MouseEvent` |
| `sizes` | `{ width, height }` of the target |
| `position` | `{ x, y }` of the target relative to the viewport |
| `pagePosition` | `{ x, y }` of the target relative to the page |
| `context`, `note`, `dependencies`, `options`, `viewport`, `type: 'click'` | Common fields |



## hover

```js
import { pluginHover } from '@peter.naydenov/shortcuts'
short.enablePlugin ( pluginHover, { wait: 320, hoverTarget: [ 'data-hover' ] })
```

**Names**: `hover: on`, `hover: off`.

**Targets**: the element under the pointer or its closest ancestor having one of the `hoverTarget` attributes. `hover: on` fires after the pointer stays on a target for `wait` ms; moving directly to another target fires `hover: off` for the old one immediately.

**Action data (`HoverEventData`)**: `target`, `event` (`MouseEvent`), `sizes`, `position`, `pagePosition` plus the common fields, `type: 'hover'`.



## scroll

```js
import { pluginScroll } from '@peter.naydenov/shortcuts'
short.enablePlugin ( pluginScroll, { scrollWait: 50, endScrollWait: 400, minSpace: 40 })
```

**Names**: `scroll: up`, `scroll: down`, `scroll: left`, `scroll: right`, `scroll: end`.
- Direction events fire after the page scrolls at least `minSpace` px (default 40) since the last event.
- `scroll: end` fires `endScrollWait` ms (default 400) after scrolling stops.

**Action data (`ScrollEventData`)**: `x`, `y` (current page scroll), `direction` (`'up' | 'down' | 'left' | 'right'`; for `scroll: end` — the last direction) plus the common fields, `type: 'scroll'`.



## form

The form plugin reacts to focus and input on form elements. Its three names are configuration functions, not events:

| Name | Receives | Returns |
|---|---|---|
| `form: watch` | `{ dependencies, context, note, options }` | CSS selector of elements to watch. Default: `'input, select, textarea, button, a'` |
| `form: define` | `{ target, context, note, dependencies, options, viewport, sizes, position, pagePosition }` | Type name for the element (your own naming). Default: `'checkbox'` for checkbox/radio, `'button'` for button/submit, otherwise `'input'` |
| `form: action` | `{ dependencies, options }` | Array of steps (required) |

**Step shape (`FormAction`)**
```js
{
    type   : 'email'      // a type returned by 'form: define'
  , timing : 'instant'    // 'in' = focus in, 'out' = focus out, 'instant' = on input
  , wait   : 300          // optional debounce for 'instant', in ms
  , fn     : ({ target, event, dependencies }) => {}   // receives FormEventData
}
```

**Example — validate on blur, autosave while typing**
```js
profile : {
      'form: watch'  : () => '#profile input, #profile textarea'
    , 'form: define' : ({ target }) => target.name === 'email' ? 'email' : 'text'
    , 'form: action' : () => [
            { type: 'email', timing: 'out',     fn: ({ target, dependencies }) => dependencies.validate.email ( target.value ) }
          , { type: 'text',  timing: 'instant', wait: 500, fn: ({ target, dependencies }) => dependencies.draft.save ( target.name, target.value ) }
      ]
}
```

**Rules**
- Steps are registered only for types that some watched element had when the context was activated. Render the form before `changeContext`, or reactivate the context after rendering.
- Pause one step kind with `short.pause ( '<type>/<timing>' )`, e.g. `short.pause ( 'email/out' )`; resume with `short.resume`.

**Action data (`FormEventData`)**: `target` (the form element), `event` (DOM event), `sizes`, `position`, `pagePosition` plus the common fields, `type: 'form'`.



## Setup actions

`'<plugin>: setup'` runs each time the context activates, for `key`, `click`, `hover`, `scroll` and `form`. It receives:
- `defaults` — a copy of the plugin defaults (built-in values merged with `enablePlugin` options)
- `options` — the options object being prepared for this context
- `dependencies` — the dependency bag

Return an object with the options to override. Overrides last while the context is active; other contexts start again from the defaults. A setup action may also be an array of functions — their results are merged in order.
