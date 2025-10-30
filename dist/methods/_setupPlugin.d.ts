export default _setupPlugin;
declare function _setupPlugin(dependencies: any, state: any): (settings: any) => {
    getPrefix: () => any;
    shortcutName: (key: any) => any;
    contextChange: () => void;
    mute: () => any;
    unmute: () => any;
    destroy: () => void;
};
