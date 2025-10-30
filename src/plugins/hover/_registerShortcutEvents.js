function _registerShortcutEvents ( dependencies, pluginState ) {
    let count = 0;
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
                        count++
                })
    return count
} // _registerShortcutEvents func.


export default _registerShortcutEvents


