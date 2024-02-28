'use strict'

function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
const 
          { ev } = dependencies
        , { 
                  listenOptions
                , currentContext : { name: contextName }
                , shortcuts 
           } = pluginState
        ;
if ( contextName == null )   return 0
Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence'      
                let isKeyboardEv = shortcutName.includes ( 'KEY:' );
                if ( !isKeyboardEv ) return
                count++
                let sequenceArraySize = shortcutName.slice(4).split(',').length;
                if ( listenOptions.maxSequence < sequenceArraySize )   listenOptions.maxSequence = sequenceArraySize
                list.forEach ( fn => ev.on ( shortcutName, fn )    )    // Enable new context shortcuts
        })
return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


