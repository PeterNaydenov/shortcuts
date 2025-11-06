/**
 * @function _registerShortcutEvents
 * @description Register hover shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex, _defaults, ev
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts, ERROR_EVENT_NAME
 * @returns {number} - Number of registered shortcuts
 * 
 * @typedef {Object} HoverSetupData
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} defaults - Default options (clone of pluginState.defaultOptions)
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 */
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
                                                                        defaults     : structuredClone ( pluginState.defaultOptions ),
                                                                        options      : pluginState.listenOptions
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


