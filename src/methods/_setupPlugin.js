/**
 * @function _setupPlugin
 * @description Setup a plugin with provided settings and dependencies
 * @param {import('../types.js').LibDependencies} dependencies - Dependencies object containing ev, extra, inAPI, API
 * @param {import('../types.js').LibState} state - State object containing currentContext, shortcuts, exposeShortcut, ERROR_EVENT_NAME
 * @returns {import('../types.js').SetupPlugin} - Returns a function that takes plugin settings and returns plugin API
 */
function _setupPlugin ( dependencies, state ) {
    
const { inAPI } = dependencies;

const { 
          currentContext
        , shortcuts
        , exposeShortcut 
        , ERROR_EVENT_NAME
    } = state

/**
 * @function _setupPlugin
 * @description Setup a plugin with provided settings
 * @param {import('../types.js').PluginSettings} settings - Plugin configuration object
 * @returns {import('../types.js').PluginAPI} - Plugin API object with methods
 */
return function _setupPlugin ( settings ) {
    const {
                   prefix                 // Plugin prefix (string)
                , _normalizeShortcutName  // Normalize shortcut plugin method (function)
                , _registerShortcutEvents // Register shortcut plugin method (function)
                , _listenDOM              // DOM listener plugin method (function)

                , pluginState             // Plugin state (object)
                , deps                    // Plugin dependencies (object)
            } = settings
        , { resetState } = deps  // Reset plugin state (function)
        ;

    pluginState.currentContext = currentContext
    pluginState.shortcuts = shortcuts
    pluginState.exposeShortcut = exposeShortcut
    pluginState.ERROR_EVENT_NAME = ERROR_EVENT_NAME

    
    
    const plugDeps = {
                ev: dependencies.ev
              , extra: dependencies.extra
              , ...deps
        }
    
    // Read shortcuts names from all context entities and normalize entries related to the plugin
    inAPI._normalizeWithPlugins ( _normalizeShortcutName )

    let countShortcuts = _registerShortcutEvents ( plugDeps, pluginState );
    const listener     = _listenDOM ( plugDeps, pluginState )   // DOM listener object with 'start' and 'stop' methods
    if ( countShortcuts > 0 )   listener.start ()

    const pluginAPI = {
                              getPrefix       : () => prefix
                            , shortcutName  : key => {   // Format a key string according plugin needs
                                                        return _normalizeShortcutName ( key )
                                                }
                            , contextChange : () => {
                                                resetState ()
                                                countShortcuts = _registerShortcutEvents ( plugDeps, pluginState )
                                                if ( countShortcuts < 1 ) {  // Remove DOM listener if there are no shortcuts in the current context
                                                                listener.stop ()
                                                    } 
                                                if ( countShortcuts > 0 ) {  // Add DOM listener if there are shortcuts in the current context
                                                                listener.start ()
                                                    }
                                        }
                            , mute    : () => listener.stop ()
                            , unmute  : () => listener.start ()
                            , destroy : () => {
                                                listener.stop ()
                                                resetState ()
                                        }
                        }; // pluginAPI
    Object.freeze ( pluginAPI )
    return pluginAPI
}} // _setupPlugin


export default _setupPlugin


