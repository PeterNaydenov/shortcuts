/**
 * @typedef {Object} _defaults
 * @property {function} watch - Function that returns CSS selector for form elements to watch
 * @property {function} define - Function that determines the type of form element
 */
export type _defaults = {
    /**
     * - Function that returns CSS selector for form elements to watch
     */
    watch: Function;
    /**
     * - Function that determines the type of form element
     */
    define: Function;
};
/**
 * @const {_defaults}
 * @description Default configuration for form plugin
 */
declare const _defaults: {
    watch: () => string;
    define: ({ target }: {
        target: any;
    }) => "button" | "checkbox" | "input";
};
export default _defaults;
