/**
 * @function _registerShortcutEvents
 * @description Register hover shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex, _defaults, ev
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts, ERROR_EVENT_NAME
 * @returns {number} - Number of registered shortcuts
 */
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
    // Options are per context. Start from the plugin defaults
    Object.keys ( pluginState.listenOptions ).forEach ( k => delete pluginState.listenOptions[k] )
    Object.assign ( pluginState.listenOptions, structuredClone ( pluginState.defaultOptions ))
    if ( contextName == null )   return count   // No context
    Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        const isHoverEv = regex.test ( shortcutName );
                        if ( !isHoverEv ) return
                        if ( shortcutName === 'HOVER:SETUP' ) {
                                        const updateOptions = list.reduce ( ( res, fn ) => {
                                                        const r = fn ({ 
                                                                        dependencies : dependencies.extra, 
                                                                        defaults     : structuredClone ( pluginState.defaultOptions ),
                                                                        options      : pluginState.listenOptions
                                                                })
                                                        return Object.assign ( res, r )
                                                }, {} )
                                        Object.assign ( pluginState.listenOptions, updateOptions )
                                        return
                            }
                        count++
                })
    return count
} // _registerShortcutEvents func.


export default _registerShortcutEvents


