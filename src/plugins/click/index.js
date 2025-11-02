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
function pluginClick ( setupPlugin, options = {}) {
        let 
                  deps = {
                                _findTarget
                             , _readClickEvent
                             , regex : /CLICK\s*\:/i
                        }
                , pluginState = {
                                  active : false
                                , defaultOptions : {
                                          mouseWait   : 320     // 320 ms
                                        , clickTarget : 'click' // Data-attribute name for click target ( data-click )
                                    }
                                , listenOptions  : {
                                                      mouseWait     : 320   // 320 ms
                                                    , maxLeftClicks : 1  // How many clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                                    , maxRightClicks: 1  // How many right clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                                    , clickTarget   : 'click' // Data-attribute name for click target ( data-click )
                                                }
                                , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false   // Keyboard stream function
                            } // pluginState
                ;

        function resetState () {
                  // TODO: No reset available at the moment
            } // resetState func.
        deps.resetState = resetState
                
        return setupPlugin ({
                                prefix: 'click'
                              , _normalizeShortcutName
                              , _registerShortcutEvents
                              , _listenDOM

                              , pluginState
                              , deps
                      })
} // pluginClick func.



export default pluginClick


