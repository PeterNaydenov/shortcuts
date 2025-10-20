'use strict'

/**
 * @typedef {Object} PluginAPI
 * @property {function(): string} getPrefix - Get plugin prefix
 * @property {function(string): string} shortcutName - Format shortcut name
 * @property {function(string): void} contextChange - Handle context change
 * @property {function(): void} mute - Mute the plugin
 * @property {function(): void} unmute - Unmute the plugin
 * @property {function(): void} destroy - Destroy the plugin
 */

import _findTarget              from "./_findTarget"
import _listenDOM              from "./_listenDOM"
import _normalizeShortcutName  from "./_normalizeShortcutName"
import _readClickEvent         from "./_readClickEvent"
import _registerShortcutEvents from "./_registerShortcutEvents"




/**
 * @function pluginClick
 * @description Plugin for mouse click shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.mouseWait=320] - Time to wait for click sequence in ms
 * @param {string} [options.clickTarget='click'] - Data attribute name for click targets
 * @returns {PluginAPI} Plugin API
 */
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
                                , active : false
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
       
        let pluginAPI = {
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
                            , mute    : () => {
                                          
                                          mouseListener.stop ()
                                      }
                            , unmute  : () => mouseListener.start ()
                            , destroy : () => mouseListener.stop ()
                        }; // pluginAPI
        Object.freeze ( pluginAPI )
        return pluginAPI
} // pluginClick func.



export default pluginClick


