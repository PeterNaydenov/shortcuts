import _normalizeWithPlugins from './_normalizeWithPlugins.js';
import _readShortcutWithPlugins from './_readShortcutWithPlugins.js';
import _systemAction from './_systemAction.js';
import load from './load.js';
import unload from './unload.js';
import changeContext from './changeContext.js';
import listShortcuts from './listShortcuts.js';
import _setupPlugin from './_setupPlugin.js';
declare const _default: {
    _normalizeWithPlugins: typeof _normalizeWithPlugins;
    _readShortcutWithPlugins: typeof _readShortcutWithPlugins;
    _setupPlugin: typeof _setupPlugin;
    _systemAction: typeof _systemAction;
    changeContext: typeof changeContext;
    listShortcuts: typeof listShortcuts;
    load: typeof load;
    unload: typeof unload;
};
export default _default;
