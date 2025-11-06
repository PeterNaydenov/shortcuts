'use strict'



// import all plugin files here
import _listenDOM from './_listenDOM.js'
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _defaults from './_defaults.js'



/**
 * @function pluginForm
 * @description Plugin for form element shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @returns {PluginAPI} Plugin API
 */
function pluginForm ( setupPlugin, options={} ) {

    let 
                 deps = {
                               _defaults
                             , regex : /FORM\s*\:/i
                        }
                , pluginState = {
                                  callbacks      : {} // Functions callbacks arranged by 'type/timing' : [ callback, ...otherCallbacks ]
                                , typeFn         : '' // Type definition function
                                , watchList      : [] // list of watched elements
                                , wait           : {} // wait time for 'instant' mode
                                , defaultOptions : {}
                                , listenOptions  : {}
                            } // pluginState
                ;
    function resetState () {
            pluginState.callbacks = {}
            pluginState.typeFn    = ''
            pluginState.watchList = []
            pluginState.wait      = {}
      } // resetState func.
    deps.resetState = resetState

    return setupPlugin ({
                        prefix : 'form'
                      , _normalizeShortcutName
                      , _registerShortcutEvents
                      , _listenDOM
                      
                      , pluginState
                      , deps
                  })
} // pluginForm func.


export default pluginForm