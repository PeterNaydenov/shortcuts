'use strict'



function unload ( shortcuts, ev, currentContext ) {
return function unload ( contextName ) {
        const current = currentContext.name;
        if ( current === contextName ) {
                    ev.emit ( 'shortcuts-error', `Context '${ contextName }' can't be removed during is current active context. Change the context first` )
                    return
            }
        if ( !shortcuts [ contextName ] ) {
                    ev.emit ( 'shortcuts-error', `Context '${ contextName }' does not exist` )
                    return
            }
        delete shortcuts [ contextName ]
}} // unload func.



export default unload


