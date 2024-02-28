'use strict'

function changeContext ( dependencies, state ) {
const 
          { 
                shortcuts
              , currentContext
          } = state
        , { ev } = dependencies
        ;



function expose () {
                ev.on ( '*', (event, ...args) => {
                                if ( state.exposeShortcut )   state.exposeShortcut ( event, ...args )
                        })
        } // expose func.



/**
 * @function changeContext
 * @description Change current context with shortcuts belonging to it.
 * @param {string} [contextName=false] - Name of context to change to. Default 'false' will switch off all shortcuts.
 * @returns {void}
 */
return function changeContext ( contextName = false ) {
        const current = currentContext.name;
        
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

        currentContext.name = contextName        
        ev.emit ( '@context-change', shortcuts[current] ) // Emit context switch event to plugins
        expose ()
}} // changeContext func.



export default changeContext


