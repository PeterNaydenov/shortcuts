function _normalizeWithPlugins ( dependencies, state ) {
return function _normalizeWithPlugins ( _normalizeShortcutName ) {
  const shortcuts = state.shortcuts;
  Object.keys ( shortcuts ).forEach ( contextName => {
                        Object.entries (shortcuts[contextName]).forEach ( ([shortcutName, callbackList]) => {
                                                const name = _normalizeShortcutName ( shortcutName )
                                                if ( name !== shortcutName ) {
                                                                delete shortcuts[contextName][shortcutName]
                                                                shortcuts[contextName][name] = callbackList
                                                        }
                                        })
                })
}} // _normalizeWithPlugins func.



export default _normalizeWithPlugins


