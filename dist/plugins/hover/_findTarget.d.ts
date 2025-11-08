export default _findTarget;
/**
 * @function _findTarget
 * @description Find the appropriate hover target element by checking if element has any of the target attributes
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions with hoverTarget array
 * @param {Element} target - DOM element to start searching from
 * @returns {Element|false} - Target element or false if not found
 */
declare function _findTarget(dependencies: any, state: any, target: Element): Element | false;
