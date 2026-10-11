'use strict'

/**
 * @function _registerShortcutEvents
 * @description Register keyboard shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts
 * @returns {number} - Number of registered shortcuts
 */
function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
const 
          { regex } = dependencies
        , { 
                  currentContext : { name: contextName }
                , shortcuts 
           } = pluginState
        ;

// Options are per context. Start from the plugin defaults
Object.keys ( pluginState.listenOptions ).forEach ( k => delete pluginState.listenOptions[k] )
Object.assign ( pluginState.listenOptions, structuredClone ( pluginState.defaultOptions ))
if ( contextName == null )   return 0
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                const isKeyboardEv = regex.test ( shortcutName );
                if ( !isKeyboardEv ) return
                if ( shortcutName === 'KEY:SETUP' ) {
                                const updateOptions = list.reduce ( ( res, fn ) => {
                                                const r = fn ({ 
                                                                dependencies : dependencies.extra, 
                                                                defaults     : structuredClone(pluginState.defaultOptions),
                                                                options      : pluginState.listenOptions 
                                                        })
                                                return Object.assign ( res, r )
                                        }, {} )
                                Object.assign ( pluginState.listenOptions, updateOptions )
                                return
                    }
                count++
                const sequenceArraySize = shortcutName.slice(4).split(',').length;
                if ( pluginState.maxSequence < sequenceArraySize )   pluginState.maxSequence = sequenceArraySize
        })

return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


