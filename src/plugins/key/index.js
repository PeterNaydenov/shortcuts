'use strict'

// import all plugin files here
import _listenDOM              from './_listenDOM.js'
import _normalizeShortcutName  from './_normalizeShortcutName.js'
import _readKeyEvent           from './_readKeyEvent.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _specialChars           from './_specialChars.js'



function pluginKey ( dependencies, state, options={} ) {
        const 
                  { currentContext, shortcuts } = state
                , { inAPI } = dependencies
                , deps = {
                             ev: dependencies.ev
                             , _specialChars
                             , _readKeyEvent
                        }
                , pluginState = {
                            currentContext
                          , shortcuts
                          , active : false
                          , listenOptions  : {
                                                  keyWait       : options.keyWait ? options.keyWait : 480   // 480 ms
                                                , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                                                , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                                        }
                          , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false   // Keyboard stream function
                          , exposeShortcut
                }; // state
                
        // Read shortcuts names from all context entities and normalize entries related to the plugin
        inAPI._normalizeWithPlugins ( _normalizeShortcutName )
                
        let 
             keysListener   = _listenDOM ( deps, pluginState )
           , countShortcuts = _registerShortcutEvents ( dependencies, pluginState )
           ;
           
        if ( countShortcuts > 0 )   keysListener.start ()
       
        const pluginAPI = {
                               getPrefix      : () => 'key'
                             , shortcutName  : key => {   // Format a key string according plugin needs
                                                     return _normalizeShortcutName ( key )   
                                                }
                             , contextChange : contextName  => {
                                                countShortcuts = _registerShortcutEvents ( deps, pluginState )
                                                if ( countShortcuts < 1 ) {  // Remove DOM listener if there are no shortcuts in the current context
                                                                keysListener.stop ()
                                                        }
                                                if ( countShortcuts > 0 ) { // Add DOM listener if there are shortcuts in the current context
                                                                keysListener.start ()
                                                        }
                                        }
                             , mute          : () => keysListener.stop ()
                             , unmute        : () => keysListener.start ()
                             , destroy       : () => {
                                                        keysListener.stop ()
                                                        pluginState = null
                                                        pluginAPI = null
                                                }
                        };
        Object.freeze ( pluginAPI )
        return pluginAPI
} // pluginKey func.



export default pluginKey


