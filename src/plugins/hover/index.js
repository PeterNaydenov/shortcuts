'use strict'

import _findTarget from "./_findTarget"
import _listenDOM from "./_listenDOM"
import _normalizeShortcutName from "./_normalizeShortcutName"
import _registerShortcutEvents from "./_registerShortcutEvents"



/**
 * @function pluginHover
 * @description Plugin for mouse hover shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {string[]} [options.hoverTarget=['data-hover']] - Array of attribute names for hover targets
 * @param {number} [options.wait=320] - Time to wait for hover sequence in ms
 * @returns {PluginAPI} Plugin API
 */
function pluginHover ( setupPlugin, options={} ) {
        let 
                 deps = {
                               _findTarget
                             , regex : /HOVER\s*\:/i
                        }
                , pluginState = {
                                //   currentContext       // { name, note } of the current context
                                  active : false          // Plugin activity state
                                , hovered : false         // False or the hovered HTML element
                                , hoverRectangle : null   // Hovered HTML element rectangle
                                , hoverTimer : null       // Timeout for reducing hover on events
                                , leaveTimer : null       // Timeout for reducing hover off events
                                , lastEvent  : ''         // 'on' or 'off'. Last executed hover event 
                                , lastHoverTarget : null  // Last hovered HTML element or null
                                , defaultOptions : {
                                                hoverTarget : [ 'data-hover' ],
                                                wait : 320  // 320 ms
                                                }
                                , listenOptions  : {
                                                hoverTarget : [ 'data-hover' ],
                                                wait : 320  // 320 ms
                                        }
                            } // pluginState
                ;
        
        function resetState () {
                        pluginState.active = false
                        pluginState.hovered = false
                        pluginState.hoverRectangle = null
                        clearTimeout ( pluginState.hoverTimer )
                        clearTimeout ( pluginState.leaveTimer )
                        pluginState.hoverTimer = null
                        pluginState.leaveTimer = null
                        pluginState.lastHoverTarget = null
            } // resetState func.
        deps.resetState = resetState

        return setupPlugin ({
                                  prefix : 'hover'
                                , _normalizeShortcutName
                                , _registerShortcutEvents
                                , _listenDOM
                                , pluginState
                                , deps
                        })
} // pluginHover func.



export default pluginHover


