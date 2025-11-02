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
function pluginForm ( setupPlugin, options={} ) {

    let 
                 deps = {
                               _defaults
                             , regex : /FORM\s*\:/i
                        }
                , pluginState = {
                                  callbacks : {} // Functions callbacks arranged by 'type/timing' : [ callback, ...otherCallbacks ]
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