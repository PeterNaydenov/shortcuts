export type PluginAPI = {
    /**
     * - Get plugin prefix
     */
    getPrefix: () => string;
    /**
     * - Format shortcut name
     */
    shortcutName: (arg0: string) => string;
    /**
     * - Handle context change
     */
    contextChange: (arg0: string) => void;
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
export type ShortcutsAPI = {
    /**
     * - Enable a plugin
     */
    enablePlugin: (arg0: Function, arg1: any) => void;
    /**
     * - Disable a plugin
     */
    disablePlugin: (arg0: string) => void;
    /**
     * - Mute a plugin
     */
    mutePlugin: (arg0: string) => number;
    /**
     * - Unmute a plugin
     */
    unmutePlugin: (arg0: string) => number;
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
    setNote: (arg0: string | null) => void;
    /**
     * - Pause shortcuts in current context
     */
    pause: (arg0: string) => void;
    /**
     * - Resume shortcuts in current context
     */
    resume: (arg0: string) => void;
    /**
     * - Emit event for shortcut
     */
    emit: (arg0: string, ...args: any[]) => void;
    /**
     * - List all context names
     */
    listContexts: () => string[];
    /**
     * - Set external dependencies
     */
    setDependencies: (arg0: any) => void;
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
    changeContext: (arg0: string | boolean) => void;
    /**
     * - List shortcuts
     */
    listShortcuts: (arg0: string | null) => string[] | any[];
    /**
     * - Load shortcuts into contexts
     */
    load: (arg0: any) => void;
    /**
     * - Unload a context
     */
    unload: (arg0: string) => void;
};
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
import pluginKey from './plugins/key/index.js';
import pluginClick from './plugins/click/index.js';
import pluginForm from './plugins/form/index.js';
import pluginHover from './plugins/hover/index.js';
import pluginScroll from './plugins/scroll/index.js';
export { main as shortcuts, pluginKey, pluginClick, pluginForm, pluginHover, pluginScroll };
