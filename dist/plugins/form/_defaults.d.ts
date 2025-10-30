export default _defaults;
declare namespace _defaults {
    function watch(): string;
    function define({ target }: {
        target: any;
    }): "input" | "checkbox" | "button";
}
