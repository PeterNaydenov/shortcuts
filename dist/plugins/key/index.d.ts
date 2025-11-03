export default pluginKey;
/**
 * @function pluginKey
 * @description Plugin for keyboard shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.keyWait=480] - Time to wait for key sequence in ms
 * @param {function} [options.streamKeys] - Function to stream key presses
 * @returns {PluginAPI} Plugin API
 */
declare function pluginKey(setupPlugin: Function, options?: {
    keyWait?: number;
    streamKeys?: Function;
}): PluginAPI;
