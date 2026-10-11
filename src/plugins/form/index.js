'use strict'



// import all plugin files here
import _listenDOM from './_listenDOM.js'
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _defaults from './_defaults.js'

/** @typedef {import('../../types.js').PluginAPI} PluginAPI */
/** @typedef {import('../../types.js').SetupPlugin} SetupPlugin */



/**
 * @function pluginForm
 * @description Plugin for form element shortcuts
 * @param {SetupPlugin} setupPlugin - Plugin setup function from the library
 * @param {Record<string, any>} [options={}] - Not used. Set form options with 'form:setup'
 * @returns {PluginAPI} Plugin API
 */
function pluginForm ( setupPlugin, options={} ) {

    const 
                 deps = {
                               _defaults
                             , regex : /FORM\s*\:/i
                        }
                , pluginState = {
                                  callbacks      : {} // Functions callbacks arranged by 'type/timing' : [ callback, ...otherCallbacks ]
                                , typeFn         : '' // Type definition function
                                , watchList      : [] // list of watched elements
                                , wait           : {} // wait time for 'instant' mode. Define by 'type'. 
                                                      // Example: { 'input': 200 }, will update from 'input' type every 200ms
                                                      // where 'input' is type received by 'define' function
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