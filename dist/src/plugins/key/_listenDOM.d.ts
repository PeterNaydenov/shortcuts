export default _listenDOM;
export type KeyEventData = {
    /**
     * - Function to wait for keys (disables key sequence)
     */
    wait: Function;
    /**
     * - Function to end waiting for keys (enables key sequence)
     */
    end: Function;
    /**
     * - Function to ignore the last key in sequence
     */
    ignore: Function;
    /**
     * - Function to check if currently waiting for keys
     */
    isWaiting: Function;
    /**
     * - Current context note
     */
    note: string | null;
    /**
     * - Current context name
     */
    context: string;
    /**
     * - Extra dependencies object
     */
    dependencies: any;
    /**
     * - Plugin state listenOptions (reference to pluginState.listenOptions)
     */
    options: any;
    /**
     * - Viewport information with X, Y, width, height
     */
    viewport: any;
    /**
     * - Event type ('key')
     */
    type: string;
};
/**
 * @function _listenDOM
 * @description Set up DOM event listeners for keyboard events
 * @param {Object} dependencies - Dependencies object containing ev, _specialChars, _readKeyEvent, extra, resetState
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 *
 * @typedef {Object} KeyEventData
 * @property {Function} wait - Function to wait for keys (disables key sequence)
 * @property {Function} end - Function to end waiting for keys (enables key sequence)
 * @property {Function} ignore - Function to ignore the last key in sequence
 * @property {Function} isWaiting - Function to check if currently waiting for keys
 * @property {string|null} note - Current context note
 * @property {string} context - Current context name
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {string} type - Event type ('key')
 */
declare function _listenDOM(dependencies: any, state: any): any;
