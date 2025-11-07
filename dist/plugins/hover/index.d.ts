export default pluginHover;
/**
 * @function pluginHover
 * @description Plugin for mouse hover shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {string[]} [options.hoverTarget=['data-hover']] - Array of attribute names for hover targets
 * @param {number} [options.wait=320] - Time to wait for hover sequence in ms
 * @returns {PluginAPI} Plugin API
 */
declare function pluginHover(setupPlugin: Function, options?: {
    hoverTarget?: string[];
    wait?: number;
}): PluginAPI;
