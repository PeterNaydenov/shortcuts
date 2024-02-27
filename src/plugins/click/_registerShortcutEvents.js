'use strict'

function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
const 
          { ev } = dependencies
        , { 
                  listenOptions
                , currentContext : { name:contextName }
                , shortcuts 
            } = pluginState
        ;

if ( contextName == null )   return 0
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                let isClickEv = shortcutName.includes ( 'CLICK:' );
                if ( !isClickEv ) return
                count++
                
                let [ ,numberClicks ] = shortcutName.slice(6).split('-');
                if ( listenOptions.maxClicks < numberClicks )   listenOptions.maxClicks = numberClicks
                list.forEach ( fn => ev.on ( shortcutName, fn )    )    // Enable new context shortcuts
        })
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


