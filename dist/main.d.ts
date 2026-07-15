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
     * - Get plugin prefix
     */
    getPrefix: () => string;
    /**
     * - Format shortcut name
     */
    shortcutName: (arg: string) => string;
    /**
     * - Handle context change
     */
    contextChange: (arg: string) => void;
    /**
     * - Mute the plugin
     */
    mute: () => void;
    /**
     * - Unmute the plugin
     */
    unmute: () => void;
    /**
     * - Destroy the plugin
     */
    destroy: () => void;
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
     * - Enable a plugin
     */
    enablePlugin: (plugin: Function, options?: any) => void;
    /**
     * - Disable a plugin
     */
    disablePlugin: (pluginName: string) => void;
    /**
     * - Mute a plugin
     */
    mutePlugin: (pluginName: string) => number;
    /**
     * - Unmute a plugin
     */
    unmutePlugin: (pluginName: string) => number;
    /**
     * - List enabled plugins
     */
    listPlugins: () => string[];
    /**
     * - Get current context name
     */
    getContext: () => string | null;
    /**
     * - Get current context note
     */
    getNote: () => string | null;
    /**
     * - Set current context note
     */
    setNote: (note: string | null) => void;
    /**
     * - Pause shortcuts in current context
     */
    pause: (name?: string) => void;
    /**
     * - Resume shortcuts in current context
     */
    resume: (name?: string) => void;
    /**
     * - Emit event for shortcut
     */
    emit: (name: string, ...args: any[]) => void;
    /**
     * - List all context names
     */
    listContexts: () => string[];
    /**
     * - Set external dependencies
     */
    setDependencies: (deps: any) => void;
    /**
     * - Get external dependencies
     */
    getDependencies: () => any;
    /**
     * - Reset the library instance
     */
    reset: () => void;
    /**
     * - Change current context
     */
    changeContext: (name?: string | boolean) => void;
    /**
     * - List shortcuts
     */
    listShortcuts: (contextName?: string | null) => string[] | contextShortcuts[] | null;
    /**
     * - Load shortcuts into contexts
     */
    load: (shortcutDefinition: any) => void;
    /**
     * - Unload a context
     */
    unload: (contextName: string) => void;
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
