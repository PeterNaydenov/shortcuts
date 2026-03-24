export default load;
/**
 * @function load
 * @description Load a context with shortcuts object
 * @param {dependencies} dependencies - Dependencies object containing API with changeContext and getContext
 * @param {state} state - State object containing shortcuts and plugins
 * @returns {function} - Returns a function that loads shortcuts
 */
declare function load(dependencies: any, state: any): Function;
