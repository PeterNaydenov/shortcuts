export default pluginClick;
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
 * @function pluginClick
 * @description Plugin for mouse click shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.mouseWait=320] - Time to wait for click sequence in ms
 * @param {string} [options.clickTarget='click'] - Data attribute name for click targets
 * @returns {PluginAPI} Plugin API
 */
declare function pluginClick(dependencies: any, state: any, options?: {
    mouseWait?: number;
    clickTarget?: string;
}): PluginAPI;
