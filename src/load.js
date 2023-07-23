'use strict'



function load ( shortcuts, readShortcut, changeContext, getContext ) {
return function load ( obj ) {
    const
           currentContextName = getContext ()
         , contextList = Object.keys ( obj )
         ;
    let hasChanges = false;
    contextList.forEach ( contextName => {
                    const description = Object.entries ( obj [ contextName ] );
                    if ( contextName === currentContextName ) hasChanges = true;
                    shortcuts [ contextName ] = {}
                    description.forEach ( ([ title, callbackList ]) => {
                                    const name = readShortcut ( title );
                                    if ( callbackList instanceof Function ) callbackList = [ callbackList ]
                                    shortcuts [contextName][ name ] = callbackList
                            }) // shortcuts.forEach
        }) // contextList.forEach
     if ( hasChanges ) {  // Reload context shortcuts after loading process if context was active
                changeContext ()
                changeContext ( currentContextName )
        }
}} // load func.



export default load


