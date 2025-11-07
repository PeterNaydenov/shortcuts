'use strict'

import _listenDOM from "./_listenDOM"
import _normalizeShortcutName from "./_normalizeShortcutName"
import _registerShortcutEvents from "./_registerShortcutEvents"



/**
 * @function pluginScroll
 * @description Plugin for scroll event shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.scrollWait=50] - Delay between scroll events in ms
 * @param {number} [options.endScrollWait=400] - Delay when scroll was stopped in ms
 * @param {number} [options.minSpace=40] - Minimum distance between scroll events in px
 * @returns {PluginAPI} Plugin API
 */
function pluginScroll ( setupPlugin, options={} ) {
    // up, down, left, right
        const 
                 deps = {
                          regex : /SCROLL\s*\:/i
                        }
                , pluginState = {
                                  active : false        // Is plugin active?
                                , lastPosition  : null  // Last scroll position
                                , lastDirection : null  // Last scroll direction
                                , defaultOptions : {
                                                scrollWait    : 50  // 50 ms. Delay between scroll events 
                                              , endScrollWait : 400 // 400 ms. When scroll was stopped.
                                              , minSpace      : 40  // 40 px. Minimum distance between scroll events
                                    }
                                , listenOptions  : {
                                                scrollWait    : 50  // 50 ms. Delay between scroll events 
                                              , endScrollWait : 400 // 400 ms. When scroll was stopped.
                                              , minSpace      : 40  // 40 px. Minimum distance between scroll events
                                        }
                            } // pluginState
                ;
        
        function resetState () {
                        pluginState.active = false
            } // resetState func.
        deps.resetState = resetState

        return setupPlugin ( {
                                  prefix : 'scroll'
                                , _normalizeShortcutName
                                , _registerShortcutEvents
                                , _listenDOM
                                , pluginState
                                , deps
                        })
} // pluginScroll func.



export default pluginScroll


