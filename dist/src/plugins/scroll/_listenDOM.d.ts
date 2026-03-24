export default _listenDOM;
export type ScrollEventData = {
    /**
     * - Current scroll X position
     */
    x: number;
    /**
     * - Current scroll Y position
     */
    y: number;
    /**
     * - Scroll direction ('up', 'down', 'left', 'right')
     */
    direction: string;
    /**
     * - Current context name
     */
    context: string;
    /**
     * - Current context note
     */
    note: string | null;
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
     * - Event type ('scroll')
     */
    type: string;
};
/**
 * @function _listenDOM
 * @description Set up DOM event listeners for scroll events
 * @param {Object} dependencies - Dependencies object containing ev, resetState, extra
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 *
 * @typedef {Object} ScrollEventData
 * @property {number} x - Current scroll X position
 * @property {number} y - Current scroll Y position
 * @property {string} direction - Scroll direction ('up', 'down', 'left', 'right')
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {string} type - Event type ('scroll')
 */
declare function _listenDOM(dependencies: any, state: any): any;
