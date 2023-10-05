'use strict'



function load ( shortcuts, _readShortcut, changeContext, getContext ) {
/**
 *  Load a context with shortcuts object
 *  @param {Object} obj - Context description object: { contextName : { shortcut : callback[] }
 *  @returns {void}
 */
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
                                    const name = _readShortcut ( title );
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


