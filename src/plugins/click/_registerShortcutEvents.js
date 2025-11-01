'use strict'

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

if ( contextName == null )   return count
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                let isClickEv = regex.test ( shortcutName );
                if ( !isClickEv ) return
                count++
                let [ button,numberClicks ] = shortcutName.slice(6).split('-');
                if ( button === 'LEFT' && listenOptions.maxLeftClicks < numberClicks      )   listenOptions.maxLeftClicks = numberClicks
                if ( button === 'RIGHT' &&listenOptions.maxRightClicks < numberClicks )   listenOptions.maxRightClicks = numberClicks
        })
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


