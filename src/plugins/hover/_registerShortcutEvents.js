function _registerShortcutEvents ( dependencies, pluginState ) {
let count = 0;
let hasSetup = false
const df = pluginState.defaultOptions;
const 
      { regex, _defaults, ev } = dependencies
    , { 
              currentContext : { name: contextName }
            , shortcuts 
            , ERROR_EVENT_NAME
        } = pluginState
    ;
    if ( contextName == null )   return count   // No context
    Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        let isHoverEv = regex.test ( shortcutName );
                        if ( !isHoverEv ) return
                        if ( shortcutName === 'HOVER:SETUP' ) {
                                        hasSetup = true
                                        let updateOptions = list.reduce ( ( res, fn ) => {
                                                        let r = fn ({ 
                                                                        dependencies : dependencies.extra, 
                                                                        defaults     : structuredClone ( pluginState.defaultOptions ) 
                                                                })
                                                        return Object.assign ( res, r )
                                                }, df )
                                        Object.assign ( pluginState.listenOptions, updateOptions )
                                        return
                            }
                        count++
                })
    if ( !hasSetup )  Object.assign ( pluginState.listenOptions, df )
    return count
} // _registerShortcutEvents func.


export default _registerShortcutEvents


