'use strict'

/**
 * @function _registerShortcutEvents
 * @description Register click shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex
 * @param {Object} pluginState - Plugin state containing listenOptions, currentContext, shortcuts, etc.
 * @returns {number} - Number of registered shortcuts
 */
function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
const 
          { regex } = dependencies
        , { 
                  listenOptions
                , currentContext : { name:contextName }
                , shortcuts 
            } = pluginState
        ;

// Options are per context. Start from the plugin defaults
Object.keys ( pluginState.listenOptions ).forEach ( k => delete pluginState.listenOptions[k] )
Object.assign ( pluginState.listenOptions, structuredClone ( pluginState.defaultOptions ))
if ( contextName == null )   return count
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                const isClickEv = regex.test ( shortcutName );
                if ( !isClickEv ) return
                if ( shortcutName === 'CLICK:SETUP' ) {
                                const updateOptions = list.reduce ( ( res, fn ) => {
                                                const r = fn ({ 
                                                                dependencies : dependencies.extra, 
                                                                defaults     : structuredClone(pluginState.defaultOptions),
                                                                options      : listenOptions 
                                                        })
                                                return Object.assign ( res, r )
                                        }, {} )
                                Object.assign ( pluginState.listenOptions, updateOptions )
                                return
                    }
                count++
                const [ button,numberClicks ] = shortcutName.slice(6).split('-');
                if ( button === 'LEFT'  && pluginState.maxLeftClicks < numberClicks  )   pluginState.maxLeftClicks = numberClicks
                if ( button === 'RIGHT' && pluginState.maxRightClicks < numberClicks )   pluginState.maxRightClicks = numberClicks
        })
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


