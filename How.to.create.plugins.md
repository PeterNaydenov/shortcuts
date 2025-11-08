# How to Create a Plugin for Shortcuts

This guide will walk you through creating a new plugin for the shortcuts library. We'll examine the existing plugins to understand the architecture and patterns, then create a step-by-step guide for building your own plugin.

## 🚀 Important: Plugins are Independent Projects

**Plugins are designed to be standalone projects**, not part of the main shortcuts library. This intentional architecture allows:

- **Independent Distribution**: Publish plugins as separate npm packages
- **Modular Usage**: Users only install the plugins they need
- **Third-Party Development**: Anyone can create and distribute plugins
- **Version Independence**: Plugins can have their own release cycles

**Usage Pattern:**
```javascript
import { shortcuts } from '@peter.naydenov/shortcuts'
import pluginTouch from 'shortcuts-touch-plugin'  // Separate package
import pluginVoice from 'my-custom-voice-plugin'  // Your own plugin

const short = shortcuts()
short.enablePlugin(pluginTouch)
short.enablePlugin(pluginVoice)
```

This guide shows you how to create such independent plugins by examining the existing plugins as reference implementations.

## Table of Contents

1. [Plugin Architecture Overview](#plugin-architecture-overview)
2. [Required Files Structure](#required-files-structure)
3. [Plugin Factory Function](#plugin-factory-function)
4. [Core Components Explained](#core-components-explained)
5. [Step-by-Step Plugin Creation](#step-by-step-plugin-creation)
6. [Plugin API and Integration](#plugin-api-and-integration)
7. [Best Practices and Patterns](#best-practices-and-patterns)
8. [Complete Example: Creating a "touch" Plugin](#complete-example-creating-a-touch-plugin)

## Plugin Architecture Overview

Every plugin for the shortcuts library follows a consistent architecture, whether it's bundled with the library or distributed as a standalone package:

```
your-plugin-project/
├── package.json                # Your plugin's package configuration
├── README.md                   # Plugin documentation
├── src/                        # Source code
│   └── index.js                # Main plugin factory
│   ├── _registerShortcutEvents.js   # Shortcut registration and setup
│   ├── _listenDOM.js              # DOM event listeners
│   ├── _normalizeShortcutName.js   # Shortcut name normalization
│   └── [plugin-specific files]     # Additional helper files
├── dist/                       # Built distribution files
└── test/                       # Plugin tests
```

**Key Points:**
- **Standalone Package**: Each plugin is its own npm package
- **No Library Dependency**: Plugins don't need to be inside the shortcuts library
- **Standard Interface**: All plugins use the same API contract
- **Independent Development**: Create, test, and publish plugins separately
src/plugins/[plugin-name]/
├── index.js                    # Main plugin factory
├── _registerShortcutEvents.js  # Shortcut registration and setup
├── _listenDOM.js               # DOM event listeners
├── _normalizeShortcutName.js   # Shortcut name normalization
└── [plugin-specific files]     # Additional helper files
```



### Key Concepts

- **Plugin Prefix**: Each plugin has a unique prefix (e.g., "click", "key", "form")
- **Shortcut Registration**: Plugins register shortcuts using regex patterns
- **Event Management**: Plugins manage DOM listeners automatically
- **State Management**: Each plugin maintains its own state and options
- **Setup Configuration**: Plugins can be configured via `[PREFIX]:SETUP` shortcuts





## Required Files Structure

### 1. `index.js` - Main Plugin Factory

This is the entry point that creates and configures the plugin.

```javascript
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _listenDOM from './_listenDOM.js'

function plugin[Name](setupPlugin, options = {}) {
    // Plugin-specific dependencies
    const deps = {
        regex: /[PREFIX]:.+/i,  // Regex to identify plugin shortcuts
        // ... other dependencies
    }

    // Plugin state
    const pluginState = {
        active: false,
        defaultOptions: { /* default configuration */ },
        listenOptions: { /* runtime configuration */ },
        // ... plugin-specific state
    }

    // Reset state function
    function resetState() {
        // Clean up timers, state, etc.
    }
    deps.resetState = resetState

    // Return configured plugin
    return setupPlugin({
        prefix: '[PREFIX]',
        _normalizeShortcutName,
        _registerShortcutEvents,
        _listenDOM,
        pluginState,
        deps
    })
}

export default plugin[Name]
```

### 2. `_registerShortcutEvents.js` - Shortcut Registration

This file handles shortcut discovery, setup, and registration.

```javascript
'use strict'

/**
 * Register plugin shortcuts and handle setup
 * @param {Object} dependencies - Plugin dependencies
 * @param {Object} pluginState - Plugin state
 * @returns {number|false} - Number of registered shortcuts
 */
function _registerShortcutEvents(dependencies, pluginState) {
    const { regex, /* other deps */ } = dependencies
    const { 
        currentContext: { name: contextName, note },
        shortcuts,
        defaultOptions
    } = pluginState

    let count = 0;
    let setupOptions = [];

    if (!contextName) return count

    // Scan for plugin shortcuts
    Object.entries(shortcuts[contextName]).forEach(([shortcutName, list]) => {
                if (!regex.test(shortcutName)) return

                // Handle SETUP shortcuts
                if ( shortcutName.includes('SETUP') ) {
                    let updateOptions = list.reduce((res, fn) => {
                                                let r = fn({
                                                    dependencies: dependencies.extra,
                                                    defaults: structuredClone(pluginState.defaultOptions),
                                                    options: pluginState.listenOptions
                                                })
                                                return Object.assign ( res, r )
                                            }, defaultOptions )
                    Object.assign(pluginState.listenOptions, updateOptions)
                    return
                }

                // Handle other shortcuts (ACTION, WATCH, etc.)
                // ... plugin-specific logic
                count++
        }) // forEach context shortcut entries
    return count
}

export default _registerShortcutEvents
```



### 3. `_listenDOM.js` - DOM Event Listeners

This file sets up and manages DOM event listeners.

```javascript
'use strict'

/**
 * Set up DOM event listeners for the plugin
 * @param {Object} dependencies - Plugin dependencies
 * @param {Object} pluginState - Plugin state
 * @param {Object} ev - Event emitter
 * @returns {Object} - Listener control object
 */
function _listenDOM ( dependencies, pluginState, ev ) {
    let listeners = [];
    let timers = [];

    function start () {
        if (pluginState.active) return
        pluginState.active = true

        // Set up DOM event listeners
        const listener = (e) => {
            // Prepare event data
            const eventData = {
                target: e.target,
                context: pluginState.currentContext.name,
                note: pluginState.currentContext.note,
                event: e,
                dependencies: dependencies.extra,
                options: pluginState.listenOptions,
                viewport: {
                    X: window.scrollX,
                    Y: window.scrollY,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
                // ... other event data
            }

            // Emit plugin-specific events
            ev.emit('[PREFIX]:EVENT', eventData)
        }

        document.addEventListener('[dom-event]', listener)
        listeners.push({ event: '[dom-event]', listener })
    }

    function stop () {
        pluginState.active = false
        
        // Remove all listeners
        listeners.forEach(({ event, listener }) => {
            document.removeEventListener(event, listener)
        })
        listeners = []

        // Clear all timers
        timers.forEach(timer => clearTimeout(timer))
        timers = []
    }

    return { start, stop }
}

export default _listenDOM
```



### 4. `_normalizeShortcutName.js` - Shortcut Normalization

This file standardizes shortcut names to UPPERCASE. Removes spaces and eliminates risk of using different letter cases. Using uppercase makes it easy to see which plugins are enabled, as all enabled plugins will normalize their shortcuts to uppercase format.

```javascript
'use strict'

/**
 * Normalize shortcut names to standard format
 * @param {string} name - Raw shortcut name
 * @returns {string} - Normalized shortcut name (UPPERCASE)
 */
function _normalizeShortcutName(name) {
    return name
        .toUpperCase()
        .split(':')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .join(':')
}

export default _normalizeShortcutName
```





## Core Components Explained

### Normalization Purpose

The normalization function converts all shortcut names to **UPPERCASE** for several important reasons:

1. **Consistency**: Eliminates variations in letter case and spacing
2. **Debugging**: Makes it easy to see which plugins are enabled - all active plugins will have their shortcuts displayed in uppercase
3. **Conflict Prevention**: Ensures different writing styles don't create duplicate shortcuts
4. **Standardization**: Provides a uniform format across all plugins

**Example:**
- Input: `'touch: Swipe-Left'` → Output: `'TOUCH:SWIPE-LEFT'`
- Input: `'  Click:left-1  '` → Output: `'CLICK:LEFT-1'`



### Plugin State Structure

Every plugin must maintain this standard state:

```javascript
const pluginState = {
    active: false,              // Whether plugin is listening
    defaultOptions: {},         // Default configuration
    listenOptions: {},          // Runtime configuration
    currentContext: {},         // Current context info by reference. Uses global context
    shortcuts: {},              // Available shortcuts by reference. Uses global shortcuts
    callbacks: {},              // Event callbacks
    wait: {},                   // Wait timers
    // ... plugin-specific state
}
```



### Dependencies Object

The dependencies object provides access to shared utilities across the library(available for all plugins):

```javascript
const deps = {
    regex: /[PREFIX]:.+/i,     // Plugin shortcut identifier
    resetState: Function,       // State cleanup function
    // ... plugin-specific helpers
}
```



### Event Data Structure

All plugins emit consistent event data:

```javascript
const eventData = {
    target: HTMLElement,        // Event target (if applicable)
    context: string,           // Current context name
    note: string|null,         // Current context note
    event: Event,              // Original DOM event
    dependencies: object,      // Extra dependencies
    options: object,           // Plugin listenOptions
    viewport: {                // Viewport information
        X: number, Y: number,
        width: number, height: number
    },
    // ... plugin-specific data
}
```






## Step-by-Step Plugin Creation

### Step 1: Define Plugin Purpose and Prefix

First, determine what your plugin will do and choose a unique prefix:

```javascript
// Example: A plugin for touch gestures
const PLUGIN_PREFIX = 'touch'
```



### Step 2: Create Your Plugin Project

Since plugins are standalone projects, create a new package for your plugin:

```bash
# Create your plugin project
mkdir shortcuts-touch-plugin
cd shortcuts-touch-plugin

# Initialize as npm package
npm init -y

# Create source directory
mkdir src

# Install shortcuts as peer dependency (optional for development)
npm install @peter.naydenov/shortcuts --save-dev

# Create plugin files
touch src/index.js
touch src/_registerShortcutEvents.js
touch src/_listenDOM.js
touch src/_normalizeShortcutName.js
```

**package.json example:**
```json
{
  "name": "shortcuts-touch-plugin",
  "version": "1.0.0",
  "description": "Touch gesture plugin for shortcuts library",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "@peter.naydenov/shortcuts": "^3.0.0"
  },
  "devDependencies": {
    "@peter.naydenov/shortcuts": "^3.5.2",
    "rollup": "^2.0.0",
    "typescript": "^4.0.0"
  }
}
```



### Step 3: Implement Core Files

Create the four required files with your plugin-specific logic.



### Step 4: Define Plugin Shortcuts

Determine what shortcuts your plugin will handle:

**Important Naming Convention:**
- The first colon (`:`) separates the **plugin name** from the **shortcut action**
- **Never use colons within the shortcut action itself**
- Use hyphens (`-`) or commas (`,`) to separate parts within the shortcut action

**Correct Examples:**
- `click: left-1` ✅ (plugin: action)
- `scroll: up` ✅ (plugin: action)  
- `touch: swipe-left` ✅ (plugin: action-detail)

**Incorrect Examples:**
- `touch:swipe:left` ❌ (colon used within action)
- `click:left:1` ❌ (colon used within action)

Following this convention ensures proper parsing and avoids conflicts with other plugins.

```javascript
// Examples for touch plugin (will be normalized to uppercase):
// 'touch: swipe-left' → 'TOUCH:SWIPE-LEFT' - Swipe left gesture
// 'touch: swipe-right' → 'TOUCH:SWIPE-RIGHT' - Swipe right gesture
// 'touch: pinch-zoom' → 'TOUCH:PINCH-ZOOM' - Pinch to zoom
// 'touch: setup' → 'TOUCH:SETUP' - Configure touch options
```



### Step 5: Implement Event Logic

Write the DOM event handling logic in `_listenDOM.js`.



### Step 6: Build and Publish Your Plugin

Since plugins are standalone packages, build and publish them independently:

```bash
# Build your plugin (using rollup, webpack, etc.)
npm run build

# Test your plugin
npm test

# Publish to npm
npm publish
```

**Example build configuration (rollup.config.js):**
```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.esm.js', format: 'esm' },
    { file: 'dist/index.umd.js', format: 'umd', name: 'ShortcutsTouchPlugin' }
  ],
  plugins: [nodeResolve()]
}
```

**Users will then install and use your plugin:**
```bash
npm install shortcuts-touch-plugin
```

```javascript
import { shortcuts } from '@peter.naydenov/shortcuts'
import pluginTouch from 'shortcuts-touch-plugin'

const short = shortcuts()
short.enablePlugin(pluginTouch)
```





## Plugin API and Integration

### Standard Plugin API

All plugins receive this standardized API from `setupPlugin`:

```javascript
const pluginAPI = setupPlugin({
    prefix: string,
    _normalizeShortcutName: Function,
    _registerShortcutEvents: Function,
    _listenDOM: Function,
    pluginState: Object,
    deps: Object
})
```



### Returned Plugin Methods

Each plugin returns these standard methods:

```javascript
const plugin = {
    getPrefix(): string,        // Returns plugin prefix
    shortcutName(key): string,  // Normalizes shortcut names
    contextChange(): void,      // Handles context changes
    mute(): void,              // Temporarily disable
    unmute(): void,            // Re-enable
    destroy(): void            // Complete cleanup
}
```






## Best Practices and Patterns

### 1. Plugin Distribution

- **Standalone Packages**: Always distribute plugins as separate npm packages
- **Naming Convention**: Use `shortcuts-[plugin-name]-plugin` format
- **Peer Dependencies**: Declare shortcuts as peer dependency, not direct dependency
- **Version Compatibility**: Specify compatible shortcuts library versions
- **Documentation**: Include comprehensive README with usage examples

### 2. Consistent Naming

- Use lowercase prefixes: `click`, `key`, `form`, `hover`, `scroll`
- Use consistent shortcut naming: `[PREFIX]:ACTION`
- Private files start with underscore: `_helper.js`



### 2. Development Workflow

- **Local Testing**: Test your plugin with local shortcuts installation
- **Multiple Environments**: Test in browsers, Node.js (if applicable)
- **Version Management**: Use semantic versioning for releases
- **CI/CD**: Set up automated testing and publishing
- **Examples**: Provide working examples in documentation

### 3. State Management

- Always provide a `resetState()` function
- Clean up timers and listeners in `stop()` methods
- Isolate state between contexts



### 3. Error Handling

- Validate input parameters
- Emit error events for invalid configurations
- Provide meaningful error messages



### 4. Performance

- Only listen when shortcuts are active
- Use event delegation where possible
- Clean up resources properly



### 5. Documentation

- Document all public functions with JSDoc
- Include type definitions for TypeScript
- Provide usage examples






## Complete Example: Creating a "touch" Plugin

Let's create a complete touch gesture plugin:

### `src/plugins/touch/index.js`

```javascript
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _listenDOM from './_listenDOM.js'

function pluginTouch(setupPlugin, options = {}) {
    const deps = {
        regex: /touch:.+/i,
        _readTouchEvent: null // Will be implemented
    }

    const pluginState = {
        active: false,
        defaultOptions: {
            swipeThreshold: 50,
            pinchThreshold: 20,
            touchTimeout: 300
        },
        listenOptions: {},
        touches: new Map(), // Track active touches
        gestures: [] // Track gesture history
    }

    function resetState() {
        pluginState.touches.clear()
        pluginState.gestures = []
    }
    deps.resetState = resetState

    return setupPlugin({
        prefix: 'touch',
        _normalizeShortcutName,
        _registerShortcutEvents,
        _listenDOM,
        pluginState,
        deps
    })
}

export default pluginTouch
```



### `src/plugins/touch/_normalizeShortcutName.js`

```javascript
'use strict'

function _normalizeShortcutName(name) {
    return name
        .toUpperCase()
        .split(':')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .join(':')
}

export default _normalizeShortcutName
```



### `src/plugins/touch/_registerShortcutEvents.js`

```javascript
'use strict'

function _registerShortcutEvents(dependencies, pluginState) {
    const { regex } = dependencies
    const { 
        currentContext: { name: contextName },
        shortcuts,
        defaultOptions
    } = pluginState

    if (!contextName) return false

    let count = 0

    Object.entries(shortcuts[contextName]).forEach(([shortcutName, list]) => {
        if (!regex.test(shortcutName)) return

        if (shortcutName.includes('SETUP')) {
            let updateOptions = list.reduce((res, fn) => {
                let r = fn({
                    dependencies: dependencies.extra,
                    defaults: structuredClone(pluginState.defaultOptions),
                    options: pluginState.listenOptions
                })
                return Object.assign(res, r)
            }, defaultOptions)
            Object.assign(pluginState.listenOptions, updateOptions)
            return
        }

        // Register touch gesture shortcuts (normalized to uppercase)
        // Example: 'touch: swipe-left' → 'TOUCH:SWIPE-LEFT', 'touch: pinch-zoom' → 'TOUCH:PINCH-ZOOM'
        count++
    })

    return count
}

export default _registerShortcutEvents
```



### `src/plugins/touch/_listenDOM.js`

```javascript
'use strict'

function _listenDOM(dependencies, pluginState, ev) {
    let listeners = []
    let touchStartTime = 0
    let touchStartPos = { x: 0, y: 0 }

    function start() {
        if (pluginState.active) return
        pluginState.active = true

        // Touch start
        const touchStartHandler = (e) => {
            touchStartTime = Date.now()
            const touch = e.touches[0]
            touchStartPos = { x: touch.clientX, y: touch.clientY }
        }

        // Touch end
        const touchEndHandler = (e) => {
            const touchEndTime = Date.now()
            const touch = e.changedTouches[0]
            const touchEndPos = { x: touch.clientX, y: touch.clientY }
            
            const deltaX = touchEndPos.x - touchStartPos.x
            const deltaY = touchEndPos.y - touchStartPos.y
            const deltaTime = touchEndTime - touchStartTime

            // Detect swipe gestures
            if (Math.abs(deltaX) > pluginState.listenOptions.swipeThreshold) {
                const direction = deltaX > 0 ? 'right' : 'left'
                const eventData = {
                    target: e.target,
                    context: pluginState.currentContext.name,
                    note: pluginState.currentContext.note,
                    event: e,
                    dependencies: dependencies.extra,
                    options: pluginState.listenOptions,
                    gesture: 'swipe',
                    direction,
                    velocity: Math.abs(deltaX) / deltaTime,
                    viewport: {
                        X: window.scrollX,
                        Y: window.scrollY,
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
                ev.emit(`touch: swipe-${direction}`, eventData)
            }
        }

        document.addEventListener('touchstart', touchStartHandler, { passive: true })
        document.addEventListener('touchend', touchEndHandler, { passive: true })

        listeners.push(
            { event: 'touchstart', listener: touchStartHandler },
            { event: 'touchend', listener: touchEndHandler }
        )
    }

    function stop() {
        pluginState.active = false
        listeners.forEach(({ event, listener }) => {
            document.removeEventListener(event, listener)
        })
        listeners = []
    }

    return { start, stop }
}

export default _listenDOM
```



### Update Main Export

Add to `src/main.js`:

```javascript
import pluginTouch from './plugins/touch/index.js'

export {
    shortcuts,
    pluginClick,
    pluginKey,
    pluginForm,
    pluginHover,
    pluginScroll,
    pluginTouch  // Add this line
}
```



### Usage Example

**For users installing your standalone plugin:**

```javascript
import { shortcuts } from '@peter.naydenov/shortcuts'
import pluginTouch from 'shortcuts-touch-plugin'  // Your published plugin

const short = shortcuts()

// Enable touch plugin
short.enablePlugin(pluginTouch)

// Define touch shortcuts (will be normalized to uppercase)
const context = {
    mobile: {
        'touch: setup': () => ({  // Becomes 'TOUCH:SETUP'
            swipeThreshold: 75,
            touchTimeout: 250
        }),
        'touch: swipe-left': ({ options, gesture, direction, velocity }) => {  // Becomes 'TOUCH:SWIPE-LEFT'
            console.log(`Swiped ${direction} with velocity ${velocity}`)
            // Navigate to previous page
        },
        'touch: swipe-right': ({ options, gesture, direction, velocity }) => {  // Becomes 'TOUCH:SWIPE-RIGHT'
            console.log(`Swiped ${direction} with velocity ${velocity}`)
            // Navigate to next page
        }
    }
}

short.load(context)
short.changeContext('mobile')
```




## Testing Your Plugin

Follow the testing patterns from existing plugins:

1. Create a test file: `test/07-[plugin-name].test.js`
2. Test plugin installation and removal
3. Test shortcut registration
4. Test event handling
5. Test setup configuration
6. Test error conditions

Example test structure:

```javascript
import { beforeEach, afterEach, describe, it, test, expect } from 'vitest'
import { shortcuts, plugin[Name] } from '../src/main.js'

describe('[Name] plugin', () => {
    let short

    beforeEach(() => {
        short = shortcuts()
        short.enablePlugin(plugin[Name])
    })

    afterEach(() => {
        short.reset()
        short.disablePlugin('[name]')
    })

    it('should register shortcuts', () => {
        // Test shortcut registration
    })

    it('should handle events', () => {
        // Test event handling
    })

    it('should handle setup configuration', () => {
        // Test setup options
    })
})
```



## Conclusion

Creating a **standalone plugin** for shortcuts follows a consistent pattern:

1. **Independent Project**: Create as separate npm package, not part of library
2. **Structure**: Use the standard file structure in your own project
3. **Integration**: Follow the setupPlugin pattern for library compatibility
4. **State Management**: Maintain clean, isolated state
5. **Events**: Emit consistent event data
6. **API**: Provide standard plugin methods
7. **Distribution**: Publish as independent package with proper dependencies
8. **Testing**: Test thoroughly following existing patterns

## 🎯 Key Takeaway

**Plugins are designed to be independent, distributable packages** - not part of the core shortcuts library. This modular architecture allows:

- **Third-party developers** to create and publish plugins
- **Users** to install only the plugins they need
- **Independent versioning** and development cycles
- **Community ecosystem** of specialized input handlers

By following this guide and studying the existing plugins, you can create robust, standalone plugins that extend the shortcuts library with new input types and capabilities, and share them with the community as independent packages.