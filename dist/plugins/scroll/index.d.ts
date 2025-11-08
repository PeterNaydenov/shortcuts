export default pluginScroll;
/**
 * @function pluginScroll
 * @description Plugin for scroll event shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.scrollWait=50] - Delay between scroll events in ms
 * @param {number} [options.endScrollWait=400] - Delay when scroll was stopped in ms
 * @param {number} [options.minSpace=40] - Minimum distance between scroll events in px
 * @returns {PluginAPI} Plugin API
 */
declare function pluginScroll(setupPlugin: Function, options?: {
    scrollWait?: number;
    endScrollWait?: number;
    minSpace?: number;
}): PluginAPI;
