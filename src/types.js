'use strict'

/**
 * Type definitions for the 'shortcuts' library.
 * The file contains JSDoc types only. Public types are re-exported from 'main.js'.
 */

export {}



// ----------------------  > COMMON < ---------------------- //

/**
 * Dependency bag provided to every action function as `data.dependencies`.
 * Always contains `emit`. Add more keys with `short.setDependencies({...})`.
 * @typedef {{ emit: (eventName: string, ...args: any[]) => void, [key: string]: any }} Dependencies
 */

/**
 * @typedef {Object} Viewport
 * @property {number} X - Horizontal page scroll (window.scrollX)
 * @property {number} Y - Vertical page scroll (window.scrollY)
 * @property {number} width - Viewport width (window.innerWidth)
 * @property {number} height - Viewport height (window.innerHeight)
 */

/**
 * @typedef {Object} Sizes
 * @property {number} width - Element width
 * @property {number} height - Element height
 */

/**
 * @typedef {Object} Position
 * @property {number} x - Horizontal position
 * @property {number} y - Vertical position
 */

/**
 * Data received by the setup action of a plugin (`key:setup`, `click:setup`, etc.).
 * The action returns options that will be merged into plugin options.
 * @template O
 * @typedef {Object} SetupData
 * @property {Dependencies} dependencies - Dependency bag
 * @property {O} defaults - Copy of the plugin default options
 * @property {O} options - Current plugin options
 */

/**
 * @template O
 * @typedef {(data: SetupData<O>) => Partial<O> | void} SetupAction
 */

/**
 * Data received by actions triggered with `short.emit(...)`
 * @typedef {Object} CustomEventData
 * @property {Dependencies} dependencies - Dependency bag
 * @property {'custom'} type - Event type
 */



// ----------------------  > PLUGIN OPTIONS < ---------------------- //

/**
 * @typedef {Object} KeyOptions
 * @property {number} keyWait - Time to wait for the next key in a sequence (ms). Default: 480
 * @property {((data: KeyStreamData) => void)|false} [streamKeys] - Function called on every key press. Set by 'key:setup' for the current context only
 */

/**
 * @typedef {Object} ClickOptions
 * @property {number} mouseWait - Time to wait for the next click in a sequence (ms). Default: 320
 * @property {string[]} clickTarget - Attribute names that mark click targets. Default: ['data-click', 'href']
 */

/**
 * @typedef {Object} HoverOptions
 * @property {number} wait - Time to wait before hover 'on' and 'off' events (ms). Default: 320
 * @property {string[]} hoverTarget - Attribute names that mark hover targets. Default: ['data-hover']
 */

/**
 * @typedef {Object} ScrollOptions
 * @property {number} scrollWait - Delay between scroll events (ms). Default: 50
 * @property {number} endScrollWait - Delay after the last scroll event before 'scroll:end' (ms). Default: 400
 * @property {number} minSpace - Minimum scroll distance between events (px). Default: 40
 */

/**
 * Form plugin has no default options. Options set by 'form:setup' are available in all form actions.
 * @typedef {Record<string, any>} FormOptions
 */



// ----------------------  > EVENT DATA < ---------------------- //

/**
 * @typedef {Object} KeyEventData
 * @property {() => void} wait - Stop the key sequence timer. Each key press triggers its own event
 * @property {() => void} end - Restore the key sequence timer
 * @property {() => void} ignore - Remove the last key from the current sequence
 * @property {() => boolean} isWaiting - True when the sequence timer is stopped by `wait()`
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Dependencies} dependencies - Dependency bag
 * @property {KeyOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {'key'} type - Event type
 */

/**
 * @typedef {Object} ClickEventData
 * @property {HTMLElement} target - Clicked element (the closest element with a click target attribute)
 * @property {number} x - Click X coordinate (clientX)
 * @property {number} y - Click Y coordinate (clientY)
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {MouseEvent} event - Original DOM event
 * @property {Dependencies} dependencies - Dependency bag
 * @property {ClickOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {Sizes} sizes - Target element sizes
 * @property {Position} position - Target element position relative to the viewport
 * @property {Position} pagePosition - Target element position relative to the page
 * @property {'click'} type - Event type
 */

/**
 * @typedef {Object} HoverEventData
 * @property {HTMLElement} target - Hovered element (the closest element with a hover target attribute)
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {MouseEvent} event - Original DOM event
 * @property {Dependencies} dependencies - Dependency bag
 * @property {HoverOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {Sizes} sizes - Target element sizes
 * @property {Position} position - Target element position relative to the viewport
 * @property {Position} pagePosition - Target element position relative to the page
 * @property {'hover'} type - Event type
 */

/**
 * @typedef {'up'|'down'|'left'|'right'} ScrollDirection
 */

/**
 * @typedef {Object} ScrollEventData
 * @property {number} x - Current horizontal scroll position
 * @property {number} y - Current vertical scroll position
 * @property {ScrollDirection|null} direction - Scroll direction. For 'scroll:end' - the last detected direction
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Dependencies} dependencies - Dependency bag
 * @property {ScrollOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {'scroll'} type - Event type
 */

/**
 * Form element watched by the form plugin. Default 'form:watch' selector also includes links (`a`)
 * @typedef {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLButtonElement} FormElement
 */

/**
 * Data received by the `fn` functions returned from 'form:action'
 * @typedef {Object} FormEventData
 * @property {FormElement} target - Form element that triggered the event
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Event} event - Original DOM event ('focusin', 'focusout' or 'input')
 * @property {Dependencies} dependencies - Dependency bag
 * @property {FormOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {Sizes} sizes - Target element sizes
 * @property {Position} position - Target element position relative to the viewport
 * @property {Position} pagePosition - Target element position relative to the page
 * @property {'form'} type - Event type
 */

/**
 * Data received by 'form:watch'. The action returns a CSS selector for the watched elements
 * @typedef {Object} FormWatchData
 * @property {Dependencies} dependencies - Dependency bag
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {FormOptions} options - Current plugin options
 */

/**
 * Data received by 'form:define'. The action returns a type name for the element
 * @typedef {Object} FormDefineData
 * @property {FormElement} target - Watched form element
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Dependencies} dependencies - Dependency bag
 * @property {FormOptions} options - Current plugin options
 * @property {Viewport} viewport - Viewport scroll positions and sizes
 * @property {Sizes} sizes - Element sizes
 * @property {Position} position - Element position relative to the viewport
 * @property {Position} pagePosition - Element position relative to the page
 */

/**
 * Data received by 'form:action'
 * @typedef {Object} FormActionData
 * @property {Dependencies} dependencies - Dependency bag
 * @property {FormOptions} options - Current plugin options
 */

/**
 * Single action description returned by 'form:action'
 * @typedef {Object} FormAction
 * @property {string} type - Element type as returned by 'form:define'
 * @property {'in'|'out'|'instant'} timing - 'in' - on focus, 'out' - on blur, 'instant' - on input
 * @property {(data: FormEventData) => void} fn - Action function
 * @property {number} [wait=0] - Debounce time for 'instant' timing (ms)
 */

/**
 * Data received by the `streamKeys` function
 * @typedef {Object} KeyStreamData
 * @property {string} key - Pressed key (KeyboardEvent.key)
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Dependencies} dependencies - Dependency bag
 */



// ----------------------  > SHORTCUT DEFINITIONS < ---------------------- //

/**
 * Removes leading and trailing spaces from a string literal type
 * @template {string} S
 * @typedef {S extends ` ${infer R}` ? Trim<R> : S extends `${infer R} ` ? Trim<R> : S} Trim
 */

/**
 * Normalized 'plugin:action' tag for a shortcut name or 'custom'
 * @template K
 * @typedef {K extends string
 *              ? string extends K ? 'custom'
 *              : Lowercase<K> extends `${infer P}:${infer R}` ? `${Trim<P>}:${Trim<R>}` : 'custom'
 *              : 'custom'
 *          } ShortcutTag
 */

/**
 * Action function type for a shortcut name. Shortcut names that don't belong to a plugin are custom events
 * with free arguments (e.g. the error event receives a message string).
 * @template K
 * @typedef {ShortcutTag<K> extends 'key:setup'         ? SetupAction<KeyOptions>
 *         : ShortcutTag<K> extends `key:${string}`     ? (data: KeyEventData, ...args: any[]) => any
 *         : ShortcutTag<K> extends 'click:setup'       ? SetupAction<ClickOptions>
 *         : ShortcutTag<K> extends `click:${string}`   ? (data: ClickEventData, ...args: any[]) => any
 *         : ShortcutTag<K> extends 'hover:setup'       ? SetupAction<HoverOptions>
 *         : ShortcutTag<K> extends `hover:${string}`   ? (data: HoverEventData, ...args: any[]) => any
 *         : ShortcutTag<K> extends 'scroll:setup'      ? SetupAction<ScrollOptions>
 *         : ShortcutTag<K> extends `scroll:${string}`  ? (data: ScrollEventData, ...args: any[]) => any
 *         : ShortcutTag<K> extends 'form:setup'        ? SetupAction<FormOptions>
 *         : ShortcutTag<K> extends 'form:watch'        ? (data: FormWatchData) => string
 *         : ShortcutTag<K> extends 'form:define'       ? (data: FormDefineData) => string
 *         : ShortcutTag<K> extends 'form:action'       ? (data: FormActionData) => FormAction[]
 *         : (...args: any[]) => any
 *         } ShortcutAction
 */

/**
 * Shortcuts of a single context: { shortcutName : action | action[] }
 * @template C
 * @typedef {{ [K in keyof C]: ShortcutAction<K> | ShortcutAction<K>[] }} ContextDefinition
 */

/**
 * Shortcut definition object: { contextName : { shortcutName : action | action[] } }
 * @template T
 * @typedef {{ [C in keyof T]: ContextDefinition<T[C]> }} ShortcutDefinition
 */

/**
 * @typedef {Object} ContextShortcuts
 * @property {string} context - Context name
 * @property {string[]} shortcuts - Shortcut names in the context
 */



// ----------------------  > PLUGINS < ---------------------- //

/**
 * API of an enabled plugin
 * @typedef {Object} PluginAPI
 * @property {() => string} getPrefix - Get plugin prefix
 * @property {(shortcutName: string) => string} shortcutName - Normalize a shortcut name
 * @property {(contextName: string) => void} contextChange - Handle context change
 * @property {() => void} mute - Stop listening for DOM events
 * @property {() => void} unmute - Start listening for DOM events
 * @property {() => void} destroy - Stop listening and reset plugin state
 */

/**
 * DOM listener of a plugin
 * @typedef {Object} PluginListener
 * @property {() => void} start - Start listening for DOM events
 * @property {() => void} stop - Stop listening for DOM events
 */

/**
 * Plugin description provided to `setupPlugin`. See 'how-to-create-a-plugin.md'
 * @typedef {Object} PluginSettings
 * @property {string} prefix - Plugin prefix (e.g. 'key')
 * @property {(shortcutName: string) => string} _normalizeShortcutName - Normalize shortcut names of the plugin
 * @property {(dependencies: Record<string, any>, pluginState: Record<string, any>) => number|false} _registerShortcutEvents - Register shortcuts of the current context. Returns the number of registered shortcuts
 * @property {(dependencies: Record<string, any>, pluginState: Record<string, any>) => PluginListener} _listenDOM - Create the DOM listener
 * @property {Record<string, any>} pluginState - Plugin state
 * @property {{ resetState: () => void, [key: string]: any }} deps - Plugin dependencies
 */

/**
 * @typedef {(settings: PluginSettings) => PluginAPI} SetupPlugin
 */

/**
 * Plugin function. Use with `short.enablePlugin(plugin, options)`
 * @typedef {(setupPlugin: SetupPlugin, options?: any) => PluginAPI} Plugin
 */



// ----------------------  > LIBRARY < ---------------------- //

/**
 * @typedef {Object} ShortcutsOptions
 * @property {(shortcutName: string, ...args: any[]) => void} [onShortcut] - Called for every triggered shortcut with the normalized shortcut name (e.g. 'KEY:CTRL+S') followed by the arguments received by the shortcut actions
 * @property {string} [errorEventName='@shortcuts-error'] - Name of the event for error messages
 */

/**
 * @typedef {Object} ShortcutsAPI
 * @property {<P extends Plugin>(plugin: P, options?: Parameters<P>[1]) => void} enablePlugin - Enable a plugin
 * @property {(pluginName: string) => void} disablePlugin - Disable a plugin
 * @property {(pluginName: string) => number} mutePlugin - Mute a plugin. Returns the plugin index or -1 if not found
 * @property {(pluginName: string) => number} unmutePlugin - Unmute a plugin. Returns the plugin index or -1 if not found
 * @property {() => string[]} listPlugins - List enabled plugin prefixes
 * @property {() => string|null} getContext - Get current context name
 * @property {() => string|null} getNote - Get current context note
 * @property {(note?: string|null) => void} setNote - Set current context note
 * @property {(shortcutName?: string) => void} pause - Pause a shortcut in current context. Default '*' - all shortcuts
 * @property {(shortcutName?: string) => void} resume - Resume a shortcut in current context. Default '*' - all shortcuts
 * @property {(shortcutName: string, ...args: any[]) => void} emit - Trigger a shortcut. Actions receive `CustomEventData` followed by `args`
 * @property {() => string[]} listContexts - List all context names
 * @property {(deps: Record<string, any>) => void} setDependencies - Add keys to the dependency bag
 * @property {() => Dependencies} getDependencies - Get the dependency bag
 * @property {() => void} reset - Reset the library instance
 * @property {(contextName?: string|boolean|null) => void} changeContext - Change current context. Without a name - switch off all shortcuts
 * @property {{ (contextName?: null): ContextShortcuts[], (contextName: string): string[]|null }} listShortcuts - List shortcuts of all contexts or shortcut names of a single context (null if the context doesn't exist)
 * @property {<T extends Record<string, Record<string, unknown>>>(shortcutDefinition: T & ShortcutDefinition<T>) => void} load - Load shortcuts into contexts
 * @property {(contextName: string) => void} unload - Unload a context. Active context can't be unloaded
 */



// ----------------------  > INTERNAL < ---------------------- //

/**
 * Event emitter used by the library ('@peter.naydenov/notice')
 * @typedef {Object} EventEmitter
 * @property {(eventName: string, fn: Function) => void} on - Subscribe to an event. '*' - all events
 * @property {(eventName: string, fn: Function) => void} once - Subscribe for a single event
 * @property {(eventName: string, fn?: Function) => void} off - Unsubscribe
 * @property {() => void} reset - Remove all subscriptions
 * @property {(eventName: string, ...args: any[]) => void} emit - Trigger an event
 * @property {(eventName: string) => void} stop - Ignore an event. '*' - all events
 * @property {(eventName: string) => void} start - Stop ignoring an event. '*' - all events
 */

/**
 * Library dependencies provided to internal methods
 * @typedef {Object} LibDependencies
 * @property {EventEmitter} ev - Event emitter instance
 * @property {Record<string, Function>} inAPI - Internal methods
 * @property {ShortcutsAPI} API - Public API
 * @property {Dependencies} extra - Dependency bag provided to the actions
 */

/**
 * Library state provided to internal methods
 * @typedef {Object} LibState
 * @property {{ name: string|null, note: string|null }} currentContext - Current context name and note
 * @property {Record<string, Record<string, Function[]>>} shortcuts - Loaded shortcuts: { contextName : { shortcutName : action[] } }
 * @property {PluginAPI[]} plugins - Enabled plugins
 * @property {Function|false|null} exposeShortcut - The `onShortcut` function or false
 * @property {string} ERROR_EVENT_NAME - Name of the error event
 */

