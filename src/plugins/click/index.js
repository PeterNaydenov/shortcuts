'use strict'



import _findTarget              from "./_findTarget"
import _listenDOM              from "./_listenDOM"
import _normalizeShortcutName  from "./_normalizeShortcutName"
import _readClickEvent         from "./_readClickEvent"
import _registerShortcutEvents from "./_registerShortcutEvents"




/**
 * @function pluginClick
 * @description Plugin for mouse click shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.mouseWait=320] - Time to wait for click sequence in ms
 * @param {string} [options.clickTarget='click'] - Data attribute name for click targets
 * @param {function} [options.streamKeys] - Function to stream key presses
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
                                , maxLeftClicks : 1  // How many clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                , maxRightClicks: 1  // How many right clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                , listenOptions  : {
                                                      mouseWait     : 320   // 320 ms
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


