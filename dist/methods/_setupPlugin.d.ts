export default _setupPlugin;
/**
 * @function _setupPlugin
 * @description Setup a plugin with provided settings and dependencies
 * @param {dependencies} dependencies - Dependencies object containing ev, extra, inAPI, API
 * @param {state} state - State object containing currentContext, shortcuts, exposeShortcut, ERROR_EVENT_NAME
 * @returns {function} - Returns a function that takes plugin settings and returns plugin API
 */
declare function _setupPlugin(dependencies: any, state: any): Function;
