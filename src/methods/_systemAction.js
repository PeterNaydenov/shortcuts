'use strict'

function _systemAction ( dependencies, state ) {
/**
 * @function _systemAction
 * @description Call a specifc plugin method.
 * @param {string} pluginName - The name of the plugin.
 * @param {string} fn - The name of the method to call.
 * @param {any} params - The parameters to pass to the method.
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


