'use strict'

/**
 * @function _systemAction
 * @description Call a specific plugin method.
 * @param {dependencies} dependencies - Dependencies object containing inAPI
 * @param {state} state - State object containing plugins array
 * @returns {function} - Returns a function that executes plugin actions
 */
function _systemAction ( dependencies, state ) {
/**
 * @function _systemAction
 * @description Call a specific plugin method.
 * @param {string} pluginName - The name of the plugin
 * @param {string} fn - The name of the method to call
 * @param {any} [params=null] - The parameters to pass to the method
 * @returns {number} - Index of the plugin in the plugins array (-1 if not found)
 */
return function _systemAction ( pluginName, fn, params=null ) {   // Specific plugin command: Mute, unmute, pause, resume, destroy
    return state.plugins.findIndex ( plugin => {
                  if ( plugin.getPrefix() === pluginName ) {  
                              if ( plugin[fn] )   plugin[fn]( params )
                              return true
                      }
                  return false
              })
}} // _systemAction func.



export default _systemAction


