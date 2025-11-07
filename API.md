# API Reference

Complete API documentation for @peter.naydenov/shortcuts library.

## Table of Contents

- [Core API](#core-api)
- [Plugin API](#plugin-api)
- [Event Data](#event-data)
- [Configuration Options](#configuration-options)
- [TypeScript Definitions](#typescript-definitions)
- [Examples](#examples)

---

## Core API

### shortcuts(options?)

Creates a new shortcuts instance with optional configuration.

**Parameters:**
- `options` (Object, optional): Global configuration options
  - `onShortcut` (Function): Callback function called when any shortcut is triggered

**Returns:** `ShortcutsAPI` instance

**Example:**
```javascript
import { shortcuts } from '@peter.naydenov/shortcuts'

const short = shortcuts({
    onShortcut: ({ shortcut, context, note }) => {
        console.log(`Shortcut triggered: ${shortcut} in context: ${context}`)
    }
})
```

### ShortcutsAPI Methods

#### load(shortcutDefinition)

Load and extend shortcut definitions.

**Parameters:**
- `shortcutDefinition` (Object): Context-based shortcut definitions

**Returns:** `void`

**Example:**
```javascript
const definition = {
    navigation: {
        'key:ctrl+s': () => console.log('Save'),
        'click:left-1': ({ target }) => console.log('Clicked:', target)
    }
}

short.load(definition)
```

#### unload(contextName)

Remove a shortcut context with all its shortcuts.

**Parameters:**
- `contextName` (string): Name of the context to remove

**Returns:** `void`

**Example:**
```javascript
short.unload('navigation')
```



#### changeContext(contextName?)

Switch to existing shortcut context or deactivate all contexts.

**Parameters:**
- `contextName` (string, optional): Name of the context to activate

**Returns:** `void`

**Example:**
```javascript
short.changeContext('navigation')  // Activate navigation context
short.changeContext()             // Deactivate all contexts
```





#### getContext()

Get the name of the current active context.

**Returns:** `string | null` - Current context name or null if no context is active

**Example:**
```javascript
const currentContext = short.getContext()
console.log('Active context:', currentContext)
```





#### setNote(note?)

Set a note for the current context (sub-context).

**Parameters:**
- `note` (string, optional): Note name or undefined to remove note

**Returns:** `void`

**Example:**
```javascript
short.setNote('special')  // Set note to 'special'
short.setNote()           // Remove note
```





#### getNote()

Get the current note for the active context.

**Returns:** `string | null` - Current note name or null if no note is set

**Example:**
```javascript
const currentNote = short.getNote()
console.log('Current note:', currentNote)
```





#### enablePlugin(plugin, options?)

Enable a plugin with optional configuration.

**Parameters:**
- `plugin` (Function): Plugin function (e.g., `pluginKey`, `pluginClick`)
- `options` (Object, optional): Plugin-specific configuration options

**Returns:** `void`

**Example:**
```javascript
import { pluginKey, pluginClick } from '@peter.naydenov/shortcuts'

short.enablePlugin(pluginKey, { keyWait: 500 })
short.enablePlugin(pluginClick, { clickTarget: ['data-action'] })
```

#### disablePlugin(pluginPrefix)

Disable a plugin by its prefix.

**Parameters:**
- `pluginPrefix` (string): Plugin prefix (e.g., 'key', 'click', 'hover')

**Returns:** `void`

**Example:**
```javascript
short.disablePlugin('key')
```

#### mutePlugin(pluginPrefix)

Temporarily mute a plugin (stop listening for events).

**Parameters:**
- `pluginPrefix` (string): Plugin prefix

**Returns:** `void`

**Example:**
```javascript
short.mutePlugin('click')  // Stop listening for click events
```

#### unmutePlugin(pluginPrefix)

Resume listening for events from a muted plugin.

**Parameters:**
- `pluginPrefix` (string): Plugin prefix

**Returns:** `void`

**Example:**
```javascript
short.unmutePlugin('click')  // Resume listening for click events
```

#### pause(shortcutName?)

Stop execution of specific shortcuts or all shortcuts in active context.

**Parameters:**
- `shortcutName` (string, optional): Specific shortcut name or '*' for all

**Returns:** `void`

**Example:**
```javascript
short.pause()                    // Pause all shortcuts
short.pause('key:ctrl+s')        // Pause specific shortcut
```

#### resume(shortcutName?)

Resume execution of paused shortcuts.

**Parameters:**
- `shortcutName` (string, optional): Specific shortcut name or '*' for all

**Returns:** `void`

**Example:**
```javascript
short.resume()                   // Resume all shortcuts
short.resume('key:ctrl+s')       // Resume specific shortcut
```

#### emit(shortcutName, data?)

Trigger a shortcut or custom event programmatically.

**Parameters:**
- `shortcutName` (string): Name of the shortcut to trigger
- `data` (Object, optional): Additional data to pass to the action function

**Returns:** `void`

**Example:**
```javascript
short.emit('key:ctrl+s', { programmatic: true })
```

#### listPlugins()

Get list of enabled plugins.

**Returns:** `string[]` - Array of plugin prefixes

**Example:**
```javascript
const enabledPlugins = short.listPlugins()
console.log('Enabled plugins:', enabledPlugins) // ['key', 'click', 'hover']
```

#### listContexts()

Get list of available contexts.

**Returns:** `string[]` - Array of context names

**Example:**
```javascript
const contexts = short.listContexts()
console.log('Available contexts:', contexts) // ['navigation', 'editor', 'viewer']
```

#### listShortcuts(contextName?)

Get list of shortcuts for a specific context or all contexts.

**Parameters:**
- `contextName` (string, optional): Context name or undefined for all contexts

**Returns:** `Object` - Context to shortcuts mapping

**Example:**
```javascript
const allShortcuts = short.listShortcuts()
const navShortcuts = short.listShortcuts('navigation')
```

#### setDependencies(dependencies)

Set external dependencies that will be available in action functions.

**Parameters:**
- `dependencies` (Object): Object containing dependencies

**Returns:** `void`

**Example:**
```javascript
short.setDependencies({
    api: myApiService,
    utils: myUtilityLibrary
})
```

#### getDependencies()

Get the current dependencies object.

**Returns:** `Object` - Current dependencies

**Example:**
```javascript
const deps = short.getDependencies()
console.log('Available dependencies:', Object.keys(deps))
```

#### reset()

Reset the shortcuts instance to initial state.

**Returns:** `void`

**Example:**
```javascript
short.reset()  // Clear all contexts, plugins, and settings
```

---

## Plugin API

### Plugin Key (pluginKey)

Handles keyboard events and shortcuts.

#### Options

```typescript
interface KeyPluginOptions {
    keyWait?: number;        // Timeout for key sequences (default: 480ms)
    streamKeys?: Function;   // Callback for each key press (default: false)
}
```

#### Shortcut Patterns

- `key:a` - Single key 'a'
- `key:ctrl+a` - Key 'a' with Ctrl modifier
- `key:ctrl+alt+shift+a` - Multiple modifiers
- `key:a,b,c` - Key sequence (a then b then c)
- `key:ctrl+a,l` - Sequence with modifiers

#### Special Keys

- Arrow keys: `left`, `right`, `up`, `down`
- Function keys: `F1` through `F12`
- Special: `enter`, `space`, `esc`, `tab`, `backspace`
- Symbols: `=`, `/`, `\`, `[`, `]`, `` ` ``

#### Example

```javascript
short.enablePlugin(pluginKey, {
    keyWait: 600,
    streamKeys: (key) => console.log('Key pressed:', key)
})

const shortcuts = {
    editor: {
        'key:setup': () => ({ keyWait: 300 }),
        'key:ctrl+s': () => saveDocument(),
        'key:ctrl+z': () => undo(),
        'key:ctrl+shift+z': () => redo(),
        'key:g,g': () => gotoLine(),
        'key:ctrl+p': () => showCommandPalette()
    }
}
```




### Plugin Click (pluginClick)

Handles mouse click events.

#### Options

```typescript
interface ClickPluginOptions {
    mouseWait?: number;           // Timeout for multiple clicks (default: 320ms)
    clickTarget?: string[];       // Target attributes (default: ['data-click', 'href'])
    streamKeys?: Function;        // Keyboard stream function
}
```

#### Shortcut Patterns

- `click:left-1` - Single left click
- `click:left-2` - Double left click
- `click:right-1` - Single right click
- `click:left-1-ctrl` - Left click with Ctrl
- `click:left-1-ctrl-alt` - Multiple modifiers

#### Target Elements

Elements with these attributes are clickable:
- `data-click="name"` - Custom click target
- `href="url"` - All anchor links (automatically included)
- `data-quick-click` - Disable multi-click detection




#### Example

```javascript
short.enablePlugin(pluginClick, {
    mouseWait: 200,
    clickTarget: ['data-action', 'data-button', 'href']
})

const shortcuts = {
    navigation: {
        'click:setup': () => ({
            mouseWait: 150,
            clickTarget: ['data-nav-item']
        }),
        'click:left-1': ({ target }) => {
            if (target.tagName === 'A') {
                event.preventDefault()
                navigateTo(target.href)
            }
        },
        'click:left-2': ({ target }) => {
            target.classList.toggle('expanded')
        }
    }
}
```

### Plugin Hover (pluginHover)

Handles mouse hover events.

#### Options

```typescript
interface HoverPluginOptions {
    wait?: number;           // Hover detection delay (default: 320ms)
    hoverTarget?: string[];   // Target attributes (default: ['data-hover'])
}
```

#### Shortcut Patterns

- `hover:on` - Mouse enters target element
- `hover:off` - Mouse leaves target element

#### Target Elements

Elements with `data-hover="name"` attribute are hover targets.

#### Example

```javascript
short.enablePlugin(pluginHover, {
    wait: 500,
    hoverTarget: ['data-interactive', 'data-tooltip']
})

const shortcuts = {
    tooltips: {
        'hover:setup': () => ({
            wait: 200,
            hoverTarget: ['data-tooltip']
        }),
        'hover:on': ({ target, targetProps }) => {
            showTooltip(target, targetProps)
        },
        'hover:off': ({ target }) => {
            hideTooltip(target)
        }
    }
}
```

### Plugin Scroll (pluginScroll)

Handles scroll events.

#### Options

```typescript
interface ScrollPluginOptions {
    scrollWait?: number;      // Delay between scroll events (default: 50ms)
    endScrollWait?: number;   // Delay when scroll stops (default: 400ms)
    minSpace?: number;        // Minimum distance between events (default: 40px)
}
```

#### Shortcut Patterns

- `scroll:up` - Scrolling up
- `scroll:down` - Scrolling down
- `scroll:left` - Scrolling left
- `scroll:right` - Scrolling right
- `scroll:end` - Scrolling has stopped

#### Example

```javascript
short.enablePlugin(pluginScroll, {
    scrollWait: 100,
    endScrollWait: 600,
    minSpace: 60
})

const shortcuts = {
    reader: {
        'scroll:setup': () => ({
            scrollWait: 150,
            minSpace: 80
        }),
        'scroll:down': () => nextPage(),
        'scroll:up': () => previousPage(),
        'scroll:end': () => saveReadingProgress()
    }
}
```

### Plugin Form (pluginForm)

Handles form element changes.

#### Options

```typescript
interface FormPluginOptions {
    // No specific options, uses default configuration
}
```

#### Shortcut Patterns

- `form:watch` - Function returning CSS selector for elements to watch
- `form:define` - Function defining element types
- `form:action` - Array of action definitions

#### Action Definition

```typescript
interface FormAction {
    fn: Function;           // Action function
    type: string;           // Element type from form:define
    timing: 'in' | 'out' | 'instant';  // When to trigger
    wait?: number;          // Debounce time for 'instant' timing
}
```

#### Example

```javascript
short.enablePlugin(pluginForm)

const shortcuts = {
    forms: {
        'form:watch': () => 'input, textarea, select',
        'form:define': ({ target }) => {
            if (target.type === 'checkbox') return 'checkbox'
            if (target.tagName === 'SELECT') return 'select'
            return 'input'
        },
        'form:action': () => [
            {
                fn: ({ target }) => console.log('Focus in:', target),
                type: 'input',
                timing: 'in'
            },
            {
                fn: ({ target }) => console.log('Focus out:', target),
                type: 'input',
                timing: 'out'
            },
            {
                fn: ({ target }) => console.log('Changed:', target.value),
                type: 'input',
                timing: 'instant',
                wait: 300
            }
        ]
    }
}
```

---

## Event Data

### Standard Event Properties

All action functions receive an object with these properties:

```typescript
interface EventData {
    context: string;        // Current context name
    note: string | null;    // Current note or null
    dependencies: Object;    // External dependencies
    event: Event;          // Original DOM event (if applicable)
    options: Object;        // Plugin-specific options
    viewport: {            // Viewport information
        X: number;         // Horizontal scroll position
        Y: number;         // Vertical scroll position
        width: number;     // Viewport width
        height: number;    // Viewport height
    };
}
```

### Plugin-Specific Properties

#### Key Plugin

```typescript
interface KeyEventData extends EventData {
    key: string;           // Pressed key
    wait: Function;        // Stop sequence timer
    end: Function;         // Resume sequence timer
    ignore: Function;      // Ignore current key from sequence
    isWaiting: boolean;    // True if sequence timer is active
}
```

#### Click/Hover Plugin

```typescript
interface MouseEventData extends EventData {
    target: HTMLElement;    // Target element
    targetProps: {         // Element coordinates
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
    } | null;
    x: number;            // X coordinate
    y: number;            // Y coordinate
}
```

#### Scroll Plugin

```typescript
interface ScrollEventData extends EventData {
    // Uses only standard EventData properties
}
```

#### Form Plugin

```typescript
interface FormActionData {
    target: HTMLElement;    // Form element
    dependencies: Object;  // External dependencies (top-level access)
}
```

---

## Configuration Options

### Global Options

```typescript
interface GlobalOptions {
    onShortcut?: Function;    // Global shortcut callback
}
```

#### onShortcut Callback

```typescript
function onShortcut({ 
    shortcut,      // string: Triggered shortcut name
    context,       // string: Current context
    note,          // string | null: Current note
    dependencies   // Object: External dependencies
}) {
    // Handle shortcut trigger
}
```

### Plugin Options

Each plugin can be configured globally or per-context:

#### Global Configuration

```javascript
short.enablePlugin(pluginKey, {
    keyWait: 500,
    streamKeys: (key) => console.log(key)
})
```

#### Per-Context Configuration

```javascript
const shortcuts = {
    myContext: {
        'key:setup': ({ dependencies, defaults }) => ({
            keyWait: 300,
            streamKeys: false
        }),
        'key:ctrl+s': () => save()
    }
}
```

---

## TypeScript Definitions

### Core Types

```typescript
interface ShortcutsAPI {
    load(shortcutDefinition: Object): void;
    unload(contextName: string): void;
    changeContext(contextName?: string): void;
    getContext(): string | null;
    setNote(note?: string): void;
    getNote(): string | null;
    enablePlugin(plugin: Function, options?: Object): void;
    disablePlugin(pluginPrefix: string): void;
    mutePlugin(pluginPrefix: string): void;
    unmutePlugin(pluginPrefix: string): void;
    pause(shortcutName?: string): void;
    resume(shortcutName?: string): void;
    emit(shortcutName: string, data?: Object): void;
    listPlugins(): string[];
    listContexts(): string[];
    listShortcuts(contextName?: string): Object;
    setDependencies(dependencies: Object): void;
    getDependencies(): Object;
    reset(): void;
}

declare function shortcuts(options?: GlobalOptions): ShortcutsAPI;
```

### Plugin Types

```typescript
interface KeyPluginOptions {
    keyWait?: number;
    streamKeys?: ((key: string) => void) | false;
}

interface ClickPluginOptions {
    mouseWait?: number;
    clickTarget?: string[];
    streamKeys?: ((key: string) => void) | false;
}

interface HoverPluginOptions {
    wait?: number;
    hoverTarget?: string[];
}

interface ScrollPluginOptions {
    scrollWait?: number;
    endScrollWait?: number;
    minSpace?: number;
}
```

---

## Examples

### Basic Usage

```javascript
import { shortcuts, pluginKey, pluginClick } from '@peter.naydenov/shortcuts'

const short = shortcuts()

// Enable plugins
short.enablePlugin(pluginKey)
short.enablePlugin(pluginClick)

// Define shortcuts
const shortcuts = {
    editor: {
        'key:ctrl+s': () => saveDocument(),
        'key:ctrl+z': () => undo(),
        'click:left-1': ({ target }) => {
            if (target.matches('.toolbar button')) {
                handleToolbarClick(target)
            }
        }
    }
}

// Load and activate
short.load(shortcuts)
short.changeContext('editor')
```

### Advanced Configuration

```javascript
const short = shortcuts({
    onShortcut: ({ shortcut, context }) => {
        console.log(`${shortcut} triggered in ${context}`)
    }
})

// Configure plugins with custom options
short.enablePlugin(pluginKey, {
    keyWait: 600,
    streamKeys: (key) => console.log('Key:', key)
})

short.enablePlugin(pluginClick, {
    mouseWait: 200,
    clickTarget: ['data-action', 'data-button', 'href']
})

short.enablePlugin(pluginHover, {
    wait: 100,
    hoverTarget: ['data-interactive']
})

// Per-context configuration
const shortcuts = {
    gaming: {
        'key:setup': () => ({ keyWait: 100 }),
        'click:setup': () => ({ mouseWait: 50 }),
        'hover:setup': () => ({ wait: 10 }),
        'key:w': () => moveUp(),
        'key:a': () => moveLeft(),
        'key:s': () => moveDown(),
        'key:d': () => moveRight()
    },
    accessibility: {
        'key:setup': () => ({ keyWait: 1000 }),
        'hover:setup': () => ({ wait: 500 }),
        'hover:on': ({ target }) => {
            announceElement(target)
        }
    }
}

short.load(shortcuts)
short.changeContext('gaming')
```

### Plugin Development Example

```javascript
// Custom touch plugin
function pluginTouch(setupPlugin, options = {}) {
    const deps = {
        regex: /TOUCH:.+/i
    }

    const pluginState = {
        active: false,
        defaultOptions: {
            swipeThreshold: 50
        },
        listenOptions: {}
    }

    function resetState() {
        // Cleanup logic
    }
    deps.resetState = resetState

    return setupPlugin({
        prefix: 'touch',
        _normalizeShortcutName: (name) => name.toUpperCase(),
        _registerShortcutEvents: (deps, state) => {
            // Registration logic
        },
        _listenDOM: (deps, state, ev) => {
            // DOM listening logic
            return { start: () => {}, stop: () => {} }
        },
        pluginState,
        deps
    })
}

// Use custom plugin
short.enablePlugin(pluginTouch, { swipeThreshold: 75 })
```

---

## Migration Guide

### From v3.x.x to v4.0.0

#### Breaking Changes

1. **Array-based target attributes:**
   ```javascript
   // v3.x.x (old)
   short.enablePlugin(pluginClick, { clickTarget: 'data-button' })
   short.enablePlugin(pluginHover, { hoverTarget: 'data-menu' })

   // v4.0.0 (new)
   short.enablePlugin(pluginClick, { clickTarget: ['data-button'] })
   short.enablePlugin(pluginHover, { hoverTarget: ['data-menu'] })
   ```

2. **Default values updated:**
   - `clickTarget`: `['data-click', 'href']` (was `'data-click'`)
   - `hoverTarget`: `['data-hover']` (was `'data-hover'`)

#### Benefits

- More flexible target detection
- Support for multiple attribute patterns
- Better compatibility with existing HTML

---

**Last updated:** November 2025  
**Version:** 4.0.0  
**Library:** @peter.naydenov/shortcuts