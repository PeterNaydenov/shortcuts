'use strict'



// import all plugin files here
import _listenDOM              from './_listenDOM.js'
import _normalizeShortcutName  from './_normalizeShortcutName.js'
import _readKeyEvent           from './_readKeyEvent.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _specialChars           from './_specialChars.js'



/**
 * @function pluginKey
 * @description Plugin for keyboard shortcuts
 * @param {function} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.keyWait=480] - Time to wait for key sequence in ms
 * @param {function} [options.streamKeys] - Function to stream key presses
 * @returns {PluginAPI} Plugin API
 */
function pluginKey ( setupPlugin, options = {} ) {
        let 
                  deps = {
                               _specialChars
                             , _readKeyEvent
                             , regex : /KEY\s*\:/i
                        }
                , pluginState = {
                            active : false
                          , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                          , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                          , defaultOptions : {
                                        keyWait : 480 // 480 ms
                                } 
                          , listenOptions  : {
                                        // Filled from 'key: setup' event in the context
                                        // or getting from the plugin the defaults
                                        keyWait : 480 // 480 ms // TODO: WHY is need initialization? Register function should fullfill it
                                }
                          , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false   // Keyboard stream function
                        } // state
                ;
        
        function resetState () {
                    pluginState.active = false
                    pluginState.keyIgnore = null
                    pluginState.maxSequence = 1
            } // resetState func.
        deps.resetState = resetState

        return setupPlugin ( {
                                prefix : 'key'
                              , _normalizeShortcutName  
                              , _registerShortcutEvents 
                              , _listenDOM              
                              , pluginState          
                              , deps                    
                        })
} // pluginKey func.



export default pluginKey


