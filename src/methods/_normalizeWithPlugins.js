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
function _normalizeWithPlugins ( dependencies, state ) {
/**
 * @function _normalizeWithPlugins
 * @description Normalize shortcut names across all contexts using plugin's normalize function
 * @param {function} _normalizeShortcutName - Plugin internal 'normalize' function
 * @returns {void}
 */
return function _normalizeWithPlugins ( _normalizeShortcutName ) {
  const shortcuts = state.shortcuts;
  Object.keys ( shortcuts ).forEach ( contextName => {
                        Object.entries (shortcuts[contextName]).forEach ( ([shortcutName, callbackList]) => {
                                                const name = _normalizeShortcutName ( shortcutName )
                                                if ( name !== shortcutName ) {
                                                                delete shortcuts[contextName][shortcutName]
                                                                shortcuts[contextName][name] = callbackList
                                                        }
                                        })
                })
}} // _normalizeWithPlugins func.



export default _normalizeWithPlugins


