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

// import all plugin files here
import _listenDOM from './_listenDOM.js'
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _defaults from './_defaults.js'



/**
 * @function pluginForm
 * @description Plugin for form element shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @returns {PluginAPI} Plugin API
 */
function pluginForm ( dependencies, state, options ) {

    let 
                  { currentContext, shortcuts } = state
                , { inAPI } = dependencies
                , deps = {
                               ev: dependencies.ev
                             , mainDependencies : dependencies
                             , regex : /FORM\s*\:/i
                             , _defaults
                        }
                , pluginState = {
                                  currentContext
                                , shortcuts
                                , callbacks : {} // Functions callbacks arranged by 'type/timing' : [ callback, ...otherCallbacks ]
                                , typeFn    : '' // Type definition function
                                , watchList : [] // list of watched elements
                                , wait      : {} // wait time for 'instant' mode
                            } // pluginState
                ;
    function resetState () {
            pluginState.callbacks = {}
            pluginState.typeFn    = ''
            pluginState.watchList = []
            pluginState.wait      = {}
      } // resetState func.

    // Read shortcuts names from all context entities and normalize entries related to the plugin
    inAPI._normalizeWithPlugins ( _normalizeShortcutName )
    let formListener = _listenDOM ( deps, pluginState );
    
    if ( currentContext.name ) {
          let hasFormShortcuts = _registerShortcutEvents ( deps, pluginState )
          if ( hasFormShortcuts )    formListener.start ()
      }
       
    let pluginAPI = {
                       getPrefix     : ( ) => 'form'
                     , shortcutName  : key => {   // Format a key string according plugin needs
                                             return _normalizeShortcutName ( key )   
                                        }
                     , contextChange : ( )  => {
                                        resetState ()
                                        let hasFormShortcuts = _registerShortcutEvents ( deps, pluginState )
                                        if ( hasFormShortcuts )    formListener.start ()
                                        else                       formListener.stop ()                                          
                                }
                     , mute          : () => formListener.stop ()
                     , unmute        : () => formListener.start ()
                     , destroy       : () => {
                                          formListener.stop ()
                                          // TODO: Clean up state of the plugin
                                }
                                        
              }; // pluginAPI
        Object.freeze ( pluginAPI )
        return pluginAPI
} // pluginForm func.


export default pluginForm