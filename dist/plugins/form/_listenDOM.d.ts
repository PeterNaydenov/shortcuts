export default _listenDOM;
export type FormEventData = {
    /**
     * - The DOM element that triggered the form event
     */
    target: Element;
    /**
     * - Current context name
     */
    context: string;
    /**
     * - Current context note
     */
    note: string | null;
    /**
     * - The original DOM event
     */
    event: Event;
    /**
     * - Reference to the library's `extra` bag. Always includes `emit: ev.emit` plus any keys you set via `short.setDependencies({...})`
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
     * - Event type ('form'). The timing (in/out/instant) lives in the emitted event name (e.g. `email/in`, `email/instant`)
     */
    type: string;
};
/**
 * @function _listenDOM
 * @description Set up DOM event listeners for form events
 * @param {Object} dependencies - Dependencies object containing ev
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 *
 * @typedef {Object} FormEventData
 * @property {Element} target - The DOM element that triggered the form event
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Event} event - The original DOM event
 * @property {Object} dependencies - Reference to the library's `extra` bag. Always includes `emit: ev.emit` plus any keys you set via `short.setDependencies({...})`
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 * @property {string} type - Event type ('form'). The timing (in/out/instant) lives in the emitted event name (e.g. `email/in`, `email/instant`)
 */
declare function _listenDOM(dependencies: any, state: any): any;
