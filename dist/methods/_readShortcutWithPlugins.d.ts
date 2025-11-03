export default _readShortcutWithPlugins;
/**
 * @function _readShortcutWithPlugins
 * @description Searches for belonging plugin and call the plugin method to normalize the shortcut name.
 * @param {dependencies} dependencies - Dependencies object containing inAPI
 * @param {state} state - State object containing plugins
 * @returns {function} - Returns a function that processes shortcut names
 */
declare function _readShortcutWithPlugins(dependencies: any, state: any): Function;
