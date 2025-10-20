export default pluginKey;
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
 * @function pluginKey
 * @description Plugin for keyboard shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.keyWait=480] - Time to wait for key sequence in ms
 * @param {function} [options.streamKeys] - Function to stream key presses
 * @returns {PluginAPI} Plugin API
 */
declare function pluginKey(dependencies: any, state: any, options?: {
    keyWait?: number;
    streamKeys?: Function;
}): PluginAPI;
