'use strict'

function changeContext ( dependencies, state ) {
const 
          { 
                shortcuts
              , currentContext
              , ERROR_EVENT_NAME
          } = state
        , { ev } = dependencies
        ;



function expose () {
                ev.on ( '*', (...args) => {
                                if ( state.exposeShortcut )   state.exposeShortcut ( ...args )
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
                        // All DOM/Mouse listeners provides trigger signal to notice(the event emitter).
                        // If event emitter was reset, all DOM/Mouse listener signals will be ignored.
                        currentContext.name = null
                        return
                }
        if ( current === contextName ) return   // Do nothing if contextName is the same as current
        if ( !shortcuts [ contextName ] ) {   // If contextName is not defined
                        ev.emit ( ERROR_EVENT_NAME, `Context '${ contextName }' does not exist` )
                        return
                }
        if ( shortcuts[current] ) {
                        ev.reset ()   // Disable all shortcuts from current context
                }

        currentContext.name = contextName 
        state.plugins.forEach ( plugin => plugin.contextChange ( contextName )    )        // Inform plugins for context change
        Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   // Enable new context shortcuts
                        list.forEach ( fn => ev.on ( shortcutName, fn )    )
                })
        expose ()
}} // changeContext func.



export default changeContext


