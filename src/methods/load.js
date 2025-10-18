'use strict'

function load ( dependencies, state ) {
const 
          { shortcuts, plugins } = state
        , {
                API : { changeContext, getContext }
          } = dependencies;
/**
 *  Load a context with shortcuts object
 *  @param {Object} shortcutsUpdate - Context description object: { contextName : { shortcut : callback[] }
 *  @returns {void}
 */
return function load ( shortcutsUpdate ) {
    const
           currentContextName = getContext ()
         , pluginPrefixList = plugins.map ( plugin => plugin.getPrefix().toUpperCase()   )
         ;
    let hasChanges = false;
    
    Object.entries ( shortcutsUpdate ).forEach ( ([contextName, contextShortcuts]) => {
                    // If changes in current context will need to reload it
                    if ( contextName === currentContextName ) hasChanges = true;
                    shortcuts [ contextName ] = {}

                    Object.entries ( contextShortcuts ).forEach ( ([ title, payload ]) => {
                                    let 
                                          name = title
                                        , test = title.toUpperCase().trim()
                                        ;
                                    let pluginIndexList = pluginPrefixList.map ( (prefix,i) => test.startsWith ( prefix ) ? i : null ).filter ( i => i !== null );
                                    if ( pluginIndexList.length ) {
                                                let id = pluginIndexList[0];
                                                name = plugins[id].shortcutName ( title )
                                        }
                                    if ( payload instanceof Function ) payload = [ payload ]
                                    shortcuts [contextName][ name ] = payload
                            }) // contextShortcuts.forEach
        }) // shortcutsUpdate.forEach
     if ( hasChanges ) {  // Reload context shortcuts after loading process if context was active
                changeContext ()
                changeContext ( currentContextName )
        }
}} // load func.



export default load


