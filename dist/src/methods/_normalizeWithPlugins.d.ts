export default _normalizeWithPlugins;
export type dependencies = {
    /**
     * - Event emitter instance
     */
    ev: any;
    /**
     * - Internal API object
     */
    inAPI: any;
    /**
     * - Public API object
     */
    API: any;
    /**
     * - Extra dependencies object
     */
    extra: any;
};
export type state = {
    /**
     * - Current context data container
     */
    currentContext: any;
    /**
     * - Shortcuts object: { contextName : { shortcut : callback[] } }
     */
    shortcuts: any;
    /**
     * - Array of active plugins
     */
    plugins: any[];
    /**
     * - Keyboard shortcut log function
     */
    exposeShortcut: Function | null;
    /**
     * - Name for error events
     */
    ERROR_EVENT_NAME: string;
};
/**
 * @typedef {Object} dependencies
 * @property {Object} ev - Event emitter instance
 * @property {Object} inAPI - Internal API object
 * @property {Object} API - Public API object
 * @property {Object} extra - Extra dependencies object
 */
/**
 * @typedef {Object} state
 * @property {Object} currentContext - Current context data container
 * @property {Object} shortcuts - Shortcuts object: { contextName : { shortcut : callback[] } }
 * @property {Array} plugins - Array of active plugins
 * @property {Function|null} exposeShortcut - Keyboard shortcut log function
 * @property {string} ERROR_EVENT_NAME - Name for error events
 */
/**
 * @function _normalizeWithPlugins
 * @description Function used by plugins during the enable process to normalize the existing and related to the plugin shortcut names.
 * @param {dependencies} dependencies - Dependencies object containing inAPI
 * @param {state} state - State object containing shortcuts
 * @returns {function} - Returns a function that takes a normalize function
 */
declare function _normalizeWithPlugins(dependencies: dependencies, state: state): Function;
