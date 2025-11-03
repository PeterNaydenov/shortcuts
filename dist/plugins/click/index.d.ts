export default pluginClick;
/**
 * @function pluginClick
 * @description Plugin for mouse click shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.mouseWait=320] - Time to wait for click sequence in ms
 * @param {string} [options.clickTarget='click'] - Data attribute name for click targets
 * @param {function} [options.streamKeys] - Function to stream key presses
 * @returns {PluginAPI} Plugin API
 */
declare function pluginClick(setupPlugin: Function, options?: {
    mouseWait?: number;
    clickTarget?: string;
    streamKeys?: Function;
}): PluginAPI;
