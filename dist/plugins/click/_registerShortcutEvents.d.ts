export default _registerShortcutEvents;
export type ClickSetupData = {
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
 * @description Register click shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex
 * @param {Object} pluginState - Plugin state containing listenOptions, currentContext, shortcuts, etc.
 * @returns {number} - Number of registered shortcuts
 *
 * @typedef {Object} ClickSetupData
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} defaults - Default options (clone of pluginState.defaultOptions)
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 */
declare function _registerShortcutEvents(dependencies: any, pluginState: any): number;
