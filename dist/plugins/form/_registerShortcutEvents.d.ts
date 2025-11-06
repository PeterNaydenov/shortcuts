export default _registerShortcutEvents;
export type FormWatchData = {
    /**
     * - Extra dependencies object
     */
    dependencies: any;
    /**
     * - Current context name
     */
    context: string;
    /**
     * - Current context note
     */
    note: string | null;
};
export type FormDefineData = {
    /**
     * - The DOM element being watched
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
};
export type FormActionData = {
    /**
     * - Extra dependencies object
     */
    dependencies: any;
};
/**
 * @function _registerShortcutEvents
 * @description Register form shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex, _defaults, ev
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts, callbacks, etc.
 * @returns {number|false} - Number of registered shortcuts or false if no actions
 *
 * @typedef {Object} FormWatchData
 * @property {Object} dependencies - Extra dependencies object
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 *
 * @typedef {Object} FormDefineData
 * @property {Element} target - The DOM element being watched
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 *
 * @typedef {Object} FormActionData
 * @property {Object} dependencies - Extra dependencies object
 */
declare function _registerShortcutEvents(dependencies: any, pluginState: any): number | false;
