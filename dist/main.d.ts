export type dependencies = {
    /**
     * - Event emitter instance
     */
    ev: any;
    /**
     * - Internal API object
     */
    inAPI: any;
    /**
     * - Public API object
     */
    API: any;
    /**
     * - Extra dependencies object
     */
    extra: any;
};
export type state = {
    /**
     * - Current context data container with name and note properties
     */
    currentContext: any;
    /**
     * - Shortcuts object: { contextName : { shortcut : callback[] } }
     */
    shortcuts: any;
    /**
     * - Array of active plugins
     */
    plugins: any[];
    /**
     * - Keyboard shortcut log function
     */
    exposeShortcut: Function | null;
    /**
     * - Name for error events
     */
    ERROR_EVENT_NAME: string;
};
export type PluginAPI = {
    /**
     * (): string} getPrefix - Get plugin prefix
     */
    : Function;
    /**
     * (string): string} shortcutName - Format shortcut name
     */
    : Function;
    /**
     * (string): void} contextChange - Handle context change
     */
    : Function;
    /**
     * (): void} mute - Mute the plugin
     */
    : Function;
    /**
     * (): void} unmute - Unmute the plugin
     */
    : Function;
    /**
     * (): void} destroy - Destroy the plugin
     */
    : Function;
};
export type contextShortcuts = {
    /**
     * - Context name
     */
    context: string;
    /**
     * - List of shortcuts in a context
     */
    shortcuts: string[];
};
export type ShortcutsAPI = {
    /**
     * (Function, Object): void} enablePlugin - Enable a plugin
     */
    : Function;
    /**
     * (string): void} disablePlugin - Disable a plugin
     */
    : Function;
    /**
     * (string): number} mutePlugin - Mute a plugin
     */
    : Function;
    /**
     * (string): number} unmutePlugin - Unmute a plugin
     */
    : Function;
    /**
     * (): string[]} listPlugins - List enabled plugins
     */
    : Function;
    /**
     * (): string|null} getContext - Get current context name
     */
    : Function;
    /**
     * (): string|null} getNote - Get current context note
     */
    : Function;
    /**
     * (string|null): void} setNote - Set current context note
     */
    : Function;
    /**
     * (string): void} pause - Pause shortcuts in current context
     */
    : Function;
    /**
     * (string): void} resume - Resume shortcuts in current context
     */
    : Function;
    /**
     * (string, ...any): void} emit - Emit event for shortcut
     */
    : Function;
    /**
     * (): string[]} listContexts - List all context names
     */
    : Function;
    /**
     * (Object): void} setDependencies - Set external dependencies
     */
    : Function;
    /**
     * (): Object} getDependencies - Get external dependencies
     */
    : Function;
    /**
     * (): void} reset - Reset the library instance
     */
    : Function;
    /**
     * (string|boolean): void} changeContext - Change current context
     */
    : Function;
    /**
     * (string|null): string[]|contextShortcuts[]|null} listShortcuts - List shortcuts
     */
    : Function;
    /**
     * (Object): void} load - Load shortcuts into contexts
     */
    : Function;
    /**
     * (string): void} unload - Unload a context
     */
    : Function;
};
import pluginKey from './plugins/key/index.js';
import pluginClick from './plugins/click/index.js';
import pluginForm from './plugins/form/index.js';
import pluginHover from './plugins/hover/index.js';
import pluginScroll from './plugins/scroll/index.js';
/**
 * @function shortcuts
 * @description Create a shortcuts instance
 * @param {Object} [options={}] - Configuration options
 * @param {function} [options.onShortcut] - Function to log shortcut events
 * @param {string} [options.errorEventName='@shortcuts-error'] - Name for error events
 * @returns {ShortcutsAPI} The shortcuts API
 */
declare function main(options?: {
    onShortcut?: Function;
    errorEventName?: string;
}): ShortcutsAPI;
/** @type {function} */
export { main as shortcuts };
export { pluginKey, pluginClick, pluginForm, pluginHover, pluginScroll };
