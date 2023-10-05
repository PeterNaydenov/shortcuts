'use strict'

function changeContext ( dependencies, state ) {
const 
          { 
               shortcuts
             , listenOptions 
             , currentContext
          } = state
        , { ev } = dependencies
        ;
return function changeContext ( contextName = false ) {
        const current = currentContext.name;
        listenOptions.maxSequence = 1
        listenOptions.maxClicks = 1
        
        if ( listenOptions.keyIgnore >= 0 ) {   
                        clearTimeout ( listenOptions.keyIgnore )
                        listenOptions.keyIgnore = null
                }

        if ( !contextName ) {   // Switch off all shortcuts if contextName is not defined
                        ev.reset ()
                        currentContext.name = null
                        return
                }
        if ( current === contextName ) return   // Do nothing if contextName is the same as current
        if ( !shortcuts [ contextName ] ) {   // If contextName is not defined
                        ev.emit ( 'shortcuts-error', `Context '${ contextName }' does not exist` )
                        return
                }
        if ( shortcuts[current] ) {
                        ev.reset ()   // Disable all shortcuts from current context
                }
        Object.entries ( shortcuts [ contextName ]).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts and set a listenOptions 'maxSequence' and 'maxClicks'       
                        let isMouseEv = shortcutName.includes ( 'MOUSE-CLICK-' );
                        if ( isMouseEv ) {   // Set mouse max clicks
                                        let [ , , , count ] = shortcutName.split('-')
                                        let c = parseInt ( count );   // Number of clicks
                                        if ( listenOptions.maxClicks < c )   listenOptions.maxClicks = c
                                }
                        else {   // Set key max sequence
                                        let sequenceArraySize = shortcutName.split(',').length;
                                        if ( listenOptions.maxSequence < sequenceArraySize )   listenOptions.maxSequence = sequenceArraySize
                                }
                        list.forEach ( fn => ev.on ( shortcutName, fn )   )    // Enable new context shortcuts
                })   
        currentContext.name = contextName
}} // changeContext func.



export default changeContext


