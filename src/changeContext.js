'use strict'



function changeContext ( shortcuts, ev, currentContext ) {
return function changeContext ( contextName=false ) {
        const current = currentContext.name;
        if ( !contextName ) {                   // Switch off all shortcuts if contextName is not defined
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
        Object.entries ( shortcuts [ contextName ]).forEach ( ([shortcutName, list ]) => {           // Enable new context shortcuts
                        if (  list instanceof Function ) {
                                        ev.on ( shortcutName, list )
                                        ev.on ( shortcutName, list )
                                        return
                                }
                        list.forEach ( fn => ev.on ( shortcutName, fn )   )
                })   
        currentContext.name = contextName
}} // changeContext func.



export default changeContext


