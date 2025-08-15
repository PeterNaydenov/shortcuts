'use strict'

// import all plugin files here
import _listenDOM from './_listenDOM.js'
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _defaults from './_defaults.js'



function pluginForm ( dependencies, state, options ) {
  /**
   * 'form: watch' - A function. Should return a string. Define a selection that will be watched for changes. example: 'input, select.color, textarea, #name'
   * 'form: define' - A function that receives every watched element. Should return text value that represents the type of the
   *                  element according custom specification. Types could be specific for every single form.
   * 'form:action' - List of Callback objects.
   *  Callback definition object:
   * {
   *   fn: function to be called
   *   type: fn should be executed on type of the element
   *   timing: 'in' | 'out' | 'instant' - when to execute the function 
   *   wait: time in milliseconds to wait before executing the function again. Works only with mode 'instant'.
   * }
   */

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
                                                pluginState = null
                                                pluginAPI = null
                                        }
              }; // pluginAPI
        Object.freeze ( pluginAPI )
        return pluginAPI
} // pluginForm func.


export default pluginForm