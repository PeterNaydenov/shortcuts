/**
 * @function unload
 * @description Unload a non-active context with shortcuts
 * @param {dependencies} dependencies - Dependencies object containing ev
 * @param {state} state - State object containing currentContext, shortcuts, ERROR_EVENT_NAME
 * @returns {function} - Returns a function that unloads contexts
 */
declare function unload(dependencies: dependencies, state: state): Function;
export default unload;
