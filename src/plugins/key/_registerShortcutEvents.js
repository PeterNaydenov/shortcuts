'use strict'

/**
 * @function _registerShortcutEvents
 * @description Register keyboard shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts
 * @returns {number} - Number of registered shortcuts
 * 
 * @typedef {Object} KeySetupData
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} defaults - Default options (clone of pluginState.defaultOptions)
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 */
function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
let hasSetup = false
const df = pluginState.defaultOptions;
const 
          { regex } = dependencies
        , { 
                  currentContext : { name: contextName }
                , shortcuts 
           } = pluginState
        ;

if ( contextName == null )   return 0
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                const isKeyboardEv = regex.test ( shortcutName );
                if ( !isKeyboardEv ) return
                if ( shortcutName === 'KEY:SETUP' ) {
                                hasSetup = true
                                const updateOptions = list.reduce ( ( res, fn ) => {
                                                const r = fn ({ 
                                                                dependencies : dependencies.extra, 
                                                                defaults     : structuredClone(pluginState.defaultOptions),
                                                                options      : pluginState.listenOptions 
                                                        })
                                                return Object.assign ( res, r )
                                        }, df )
                                Object.assign ( pluginState.listenOptions, updateOptions )
                                return
                    }
                count++
                const sequenceArraySize = shortcutName.slice(4).split(',').length;
                if ( pluginState.maxSequence < sequenceArraySize )   pluginState.maxSequence = sequenceArraySize
        })

if ( !hasSetup )   Object.assign ( pluginState.listenOptions, df )
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


