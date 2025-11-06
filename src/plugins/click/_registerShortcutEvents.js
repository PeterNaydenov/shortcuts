'use strict'

function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
let hasSetup = false;
const df = pluginState.defaultOptions;
const 
          { regex } = dependencies
        , { 
                  listenOptions
                , currentContext : { name:contextName }
                , shortcuts 
            } = pluginState
        ;

if ( contextName == null )   return count
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                let isClickEv = regex.test ( shortcutName );
                if ( !isClickEv ) return
                if ( shortcutName === 'CLICK:SETUP' ) {
                                hasSetup = true
                                let updateOptions = list.reduce ( ( res, fn ) => {
                                                let r = fn ({ 
                                                                dependencies : dependencies.extra, 
                                                                defaults     : structuredClone(pluginState.defaultOptions),
                                                                options      : listenOptions 
                                                        })
                                                return Object.assign ( res, r )
                                        }, df )
                                Object.assign ( pluginState.listenOptions, updateOptions )
                                return
                    }
                count++
                let [ button,numberClicks ] = shortcutName.slice(6).split('-');
                if ( button === 'LEFT'  && pluginState.maxLeftClicks < numberClicks  )   pluginState.maxLeftClicks = numberClicks
                if ( button === 'RIGHT' && pluginState.maxRightClicks < numberClicks )   pluginState.maxRightClicks = numberClicks
        })
if ( !hasSetup )   Object.assign ( pluginState.listenOptions, df )
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


