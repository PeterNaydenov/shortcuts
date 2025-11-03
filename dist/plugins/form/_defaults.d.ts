export default _defaults;
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
declare namespace _defaults {
    function watch(): string;
    function define({ target }: {
        target: any;
    }): "input" | "checkbox" | "button";
}
