export default _listenDOM;
export type ClickEventData = {
    /**
     * - The DOM element that was clicked
     */
    target: Element;
    /**
     * - X coordinate of the click event
     */
    x: number;
    /**
     * - Y coordinate of the click event
     */
    y: number;
    /**
     * - Current context name
     */
    context: string;
    /**
     * - Current context note
     */
    note: string | null;
    /**
     * - Plugin state listenOptions (reference to pluginState.listenOptions)
     */
    options: any;
    /**
     * - The original DOM event
     */
    event: Event;
    /**
     * - Extra dependencies object
     */
    dependencies: any;
    /**
     * - Viewport information with X, Y, width, height
     */
    viewport: any;
    /**
     * - Element dimensions with width, height
     */
    sizes: any;
    /**
     * - Element position relative to viewport with x, y
     */
    position: any;
    /**
     * - Element position relative to page with x, y
     */
    pagePosition: any;
    /**
     * - Event type ('click')
     */
    type: string;
};
/**
 * @function _listenDOM
 * @description Set up DOM event listeners for click events
 * @param {Object} dependencies - Dependencies object containing ev, _findTarget, _readClickEvent, extra, resetState
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 *
 * @typedef {Object} ClickEventData
 * @property {Element} target - The DOM element that was clicked
 * @property {number} x - X coordinate of the click event
 * @property {number} y - Y coordinate of the click event
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Event} event - The original DOM event
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 * @property {string} type - Event type ('click')
 */
declare function _listenDOM(dependencies: any, state: any): any;
