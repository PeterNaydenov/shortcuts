export default pluginForm;
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
/**
 * @function pluginForm
 * @description Plugin for form element shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @returns {PluginAPI} Plugin API
 */
declare function pluginForm(dependencies: any, state: any, options?: any): PluginAPI;
