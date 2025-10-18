'use strict'
function _readShortcutWithPlugins ( dependencies, state ) {
/**
 * @function _readShortcutWithPlugins
 * @description Searches for belonging plugin and call the plugin method to normalize the shortcut name.
 * @param {string} shortcut - The shortcut to read.
 * @returns {string} - The normalized shortcut name.
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


