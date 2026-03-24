export default changeContext;
/**
 * @function changeContext
 * @description Change current context with shortcuts belonging to it
 * @param {dependencies} dependencies - Dependencies object containing ev
 * @param {state} state - State object containing shortcuts, currentContext, ERROR_EVENT_NAME
 * @returns {function} - Returns a function that changes context
 */
declare function changeContext(dependencies: any, state: any): Function;
