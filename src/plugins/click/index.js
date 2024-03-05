'use strict'

import _findTarget              from "./_findTarget"
import _listenDOM              from "./_listenDOM"
import _normalizeShortcutName  from "./_normalizeShortcutName"
import _readClickEvent         from "./_readClickEvent"
import _registerShortcutEvents from "./_registerShortcutEvents"




function pluginClick ( dependencies, state, options ) {
        let 
                  { currentContext, shortcuts } = state
                , { inAPI } = dependencies
                , deps = {
                                ev: dependencies.ev
                             , _findTarget
                             , _readClickEvent
                             , mainDependencies : dependencies
                             , regex : /CLICK\s*\:/i
                        }
                , pluginState = {
                                  currentContext
                                , shortcuts
                                , listenOptions  : {
                                                      mouseWait     : options.mouseWait ? options.mouseWait : 320   // 320 ms
                                                    , maxClicks     : 1  // How many clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                                    , clickTarget   : options.clickTarget ? options.clickTarget :  'click' // Data-attribute name for click target ( data-click )
                                                }
                            } // pluginState
                ; 

        // Read shortcuts names from all context entities and normalize entries related to the plugin
        inAPI._normalizeWithPlugins ( _normalizeShortcutName )
        
        let 
             mouseListener = _listenDOM ( deps, pluginState )
           , countShortcuts = _registerShortcutEvents ( deps, pluginState )
           ;
      
        if ( countShortcuts > 0 )   mouseListener.start ()
       
        const pluginAPI = {
                               getPrefix      : () => 'click'
                             , shortcutName  : key => {   // Format a key string according plugin needs
                                                        return _normalizeShortcutName ( key )
                                                }
                             , contextChange : () => {
                                                countShortcuts = _registerShortcutEvents ( deps, pluginState )
                                                if ( countShortcuts < 1 ) {  // Remove DOM listener if there are no shortcuts in the current context
                                                                mouseListener.stop ()
                                                    } 
                                                if ( countShortcuts > 0 ) {  // Add DOM listener if there are shortcuts in the current context
                                                                mouseListener.start ()
                                                    }
                                        }
                            , mute    : () => mouseListener.stop ()
                            , unmute  : () => mouseListener.start ()
                            , destroy : () => {
                                                mouseListener.stop ()
                                                pluginState = null
                                                pluginAPI = null
                                        }
                        }; // pluginAPI
        Object.freeze ( pluginAPI )
        return pluginAPI
} // pluginClick func.



export default pluginClick


