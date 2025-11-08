export default _registerShortcutEvents;
export type ScrollSetupData = {
    /**
     * - Extra dependencies object
     */
    dependencies: any;
    /**
     * - Default options (clone of pluginState.defaultOptions)
     */
    defaults: any;
    /**
     * - Plugin state listenOptions (reference to pluginState.listenOptions)
     */
    options: any;
};
/**
 * @function _registerShortcutEvents
 * @description Register scroll shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts
 * @returns {number} - Number of registered shortcuts
 *
 * @typedef {Object} ScrollSetupData
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} defaults - Default options (clone of pluginState.defaultOptions)
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 */
declare function _registerShortcutEvents(dependencies: any, pluginState: any): number;
