function _registerShortcutEvents ( dependencies, pluginState ) {
    let count = 0;
    const
          { regex } = dependencies
        , {
                  currentContext : { name: contextName }
                , shortcuts
           } = pluginState
        ;
    if ( contextName == null )   return count   // No context
    Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {
                        let isScrollEv = regex.test ( shortcutName );
                        if ( !isScrollEv ) return
                        count++
                })
    return count
} // _registerShortcutEvents func.


export default _registerShortcutEvents


