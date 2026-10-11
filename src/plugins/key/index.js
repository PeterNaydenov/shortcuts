'use strict'



// import all plugin files here
import _listenDOM              from './_listenDOM.js'
import _normalizeShortcutName  from './_normalizeShortcutName.js'
import _readKeyEvent           from './_readKeyEvent.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _specialChars           from './_specialChars.js'

/** @typedef {import('../../types.js').PluginAPI} PluginAPI */
/** @typedef {import('../../types.js').SetupPlugin} SetupPlugin */



/**
 * @function pluginKey
 * @description Plugin for keyboard shortcuts
 * @param {SetupPlugin} setupPlugin - Plugin setup function from the library
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.keyWait=480] - Time to wait for key sequence in ms
 * @param {(data: import('../../types.js').KeyStreamData) => void} [options.streamKeys] - Function called on every key press. 'key:setup' can override it for a context
 * @returns {PluginAPI} Plugin API
 */
function pluginKey ( setupPlugin, options = {} ) {
        const 
                  deps = {
                               _specialChars
                             , _readKeyEvent
                             , regex : /KEY\s*\:/i
                        }
                , pluginState = {
                            active : false
                          , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                          , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                          , defaultOptions : {   // Plugin options. Can be changed by 'enablePlugin' options
                                        keyWait : ( typeof options.keyWait === 'number' ) ? options.keyWait : 480 // 480 ms
                                } 
                          , listenOptions  : {}  // Options for the current context: defaultOptions + result of 'key:setup'
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


