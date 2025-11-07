export default _findTarget;
/**
 * @function _findTarget
 * @description Find the appropriate click target element by checking if element has any of the target attributes
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions with clickTarget array
 * @param {Element} target - DOM element to start searching from
 * @returns {Element|null} - Target element or null if not found
 */
declare function _findTarget(dependencies: any, state: any, target: Element): Element | null;
