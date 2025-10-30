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
import _listenDOM              from './_listenDOM.js'
import _normalizeShortcutName  from './_normalizeShortcutName.js'
import _readKeyEvent           from './_readKeyEvent.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _specialChars           from './_specialChars.js'



/**
 * @function pluginKey
 * @description Plugin for keyboard shortcuts
 * @param {Object} dependencies - Internal dependencies
 * @param {Object} state - Library state
 * @param {Object} [options={}] - Plugin options
 * @param {number} [options.keyWait=480] - Time to wait for key sequence in ms
 * @param {function} [options.streamKeys] - Function to stream key presses
 * @returns {PluginAPI} Plugin API
 */
function pluginKey ( dependencies, state, options={} ) {
        let 
                  { currentContext, shortcuts, exposeShortcut } = state
                , { inAPI } = dependencies
                , deps = {
                             ev: dependencies.ev
                             , _specialChars
                             , _readKeyEvent
                             , mainDependencies : dependencies
                             , regex : /KEY\s*\:/i
                        }
                , pluginState = {
                            currentContext
                          , shortcuts
                          , active : false
                          , listenOptions  : {
                                                  keyWait       : options.keyWait ? options.keyWait : 480   // 480 ms
                                                , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                                                , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                                        }
                          , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false   // Keyboard stream function
                          , exposeShortcut
                }; // state
        
        function resetState () {
                    pluginState.active = false
                    pluginState.listenOptions.keyIgnore = null
                    pluginState.listenOptions.maxSequence = 1
            } // resetState func.
        deps.resetState = resetState

        return inAPI._setupPlugin ( {
                                prefix : 'key'
                              , _normalizeShortcutName  
                              , _registerShortcutEvents 
                              , _listenDOM              
                              , pluginState             
                              , deps                    
                        })
} // pluginKey func.



export default pluginKey


