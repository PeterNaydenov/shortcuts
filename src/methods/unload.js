'use strict'

function unload ( dependencies, state ) {
const 
     { currentContext, shortcuts, ERROR_EVENT_NAME } = state
   , { ev } = dependencies
   ;
/**
 * @function unload
 * @description Unload a non-active context with shortcuts.
 * @param {string} contextName - Context name to unload
 * @returns {void}
 */
return function unload ( contextName ) {
        const current = currentContext.name;
        if ( current === contextName ) {
                    ev.emit ( ERROR_EVENT_NAME, `Context '${ contextName }' can't be removed during is current active context. Change the context first` )
                    return
            }
        if ( !shortcuts [ contextName ] ) {
                    ev.emit ( ERROR_EVENT_NAME, `Context '${ contextName }' does not exist` )
                    return
            }
        delete shortcuts [ contextName ]
}} // unload func.



export default unload


