function _normalizeWithPlugins ( dependencies, state ) {
/**
 * @function _normalizeWithPlugins
 * @description Function used by plugins during the enable process to normalize the existing and related to the plugin shortcut names.
 * @param {function} _normalizeShortcutName - Plugin internal 'normalize' function.
 * @returns {void}
 */
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


