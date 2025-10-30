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

        function resetState () {
                  // TODO: No reset available at the moment
            } // resetState func.
        deps.resetState = resetState
                
        return inAPI._setupPlugin ({
                                          prefix: 'click'
                                        , _normalizeShortcutName
                                        , _registerShortcutEvents
                                        , _listenDOM

                                        , pluginState
                                        , deps
                                })
} // pluginClick func.



export default pluginClick


