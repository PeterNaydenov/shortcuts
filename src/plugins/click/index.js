'use strict'



import _findTarget              from "./_findTarget"
import _listenDOM              from "./_listenDOM"
import _normalizeShortcutName  from "./_normalizeShortcutName"
import _readClickEvent         from "./_readClickEvent"
import _registerShortcutEvents from "./_registerShortcutEvents"

/** @typedef {import('../../types.js').PluginAPI} PluginAPI */
/** @typedef {import('../../types.js').SetupPlugin} SetupPlugin */




/**
 * @function pluginClick
 * @description Plugin for mouse click shortcuts
 * @param {SetupPlugin} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.mouseWait=320] - Time to wait for click sequence in ms
 * @param {string[]} [options.clickTarget=['data-click', 'href']] - Array of attribute names for click targets
 * @param {Function} [options.streamKeys] - Deprecated. Not used by the click plugin. Use the key plugin option
 * @returns {PluginAPI} Plugin API
 */
function pluginClick ( setupPlugin, options = {}) {
        const 
                  deps = {
                                _findTarget
                             , _readClickEvent
                             , regex : /CLICK\s*\:/i
                        }
                , pluginState = {
                                  active : false
                                , maxLeftClicks : 1  // How many clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                , maxRightClicks: 1  // How many right clicks can be pressed in a sequence. Controlled automatically by '_registerShortcutEvents' function.
                                , defaultOptions : {   // Plugin options. Can be changed by 'enablePlugin' options
                                          mouseWait   : ( typeof options.mouseWait === 'number' ) ? options.mouseWait : 320     // 320 ms
                                        , clickTarget : Array.isArray ( options.clickTarget ) ? [ ...options.clickTarget ] : [ 'data-click', 'href' ]   // Attribute names as click targets
                                    }
                                , listenOptions  : {}  // Options for the current context: defaultOptions + result of 'click:setup'
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


