function _setupPlugin ( dependencies, state ) {
    
const { inAPI } = dependencies;

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
    
    // Read shortcuts names from all context entities and normalize entries related to the plugin
    inAPI._normalizeWithPlugins ( _normalizeShortcutName )

    let 
             listener = _listenDOM ( deps, pluginState )   // DOM listener object with 'start' and 'stop' methods
           , countShortcuts = _registerShortcutEvents ( deps, pluginState )
           ;

     if ( countShortcuts > 0 )   listener.start ()


    let pluginAPI = {
                              getPrefix       : () => prefix
                            , shortcutName  : key => {   // Format a key string according plugin needs
                                                        return _normalizeShortcutName ( key )
                                                }
                            , contextChange : () => {
                                                resetState ()
                                                countShortcuts = _registerShortcutEvents ( deps, pluginState )
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


