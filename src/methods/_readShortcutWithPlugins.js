'use strict'
/**
 * @function _readShortcutWithPlugins
 * @description Searches for belonging plugin and call the plugin method to normalize the shortcut name.
 * @param {dependencies} dependencies - Dependencies object containing inAPI
 * @param {state} state - State object containing plugins
 * @returns {function} - Returns a function that processes shortcut names
 */
function _readShortcutWithPlugins ( dependencies, state ) {
/**
 * @function _readShortcutWithPlugins
 * @description Searches for belonging plugin and call the plugin method to normalize the shortcut name.
 * @param {string} shortcut - The shortcut to read
 * @returns {string} - The normalized shortcut name
 */
return function _readShortcutWithPlugins ( shortcut ) {
    const 
          {  inAPI } = dependencies
        , pluginName = shortcut.split(':')[0].toLowerCase().trim()
        , ix = inAPI._systemAction ( pluginName, 'none' )  // Find a index. Don't call any method.
        ;
       
        let pausedEvent = shortcut;
        if ( ix !== -1 )    pausedEvent = state.plugins[ix].shortcutName ( shortcut )
        return pausedEvent
}} // _readShortcutWithPlugins func.



export default _readShortcutWithPlugins


