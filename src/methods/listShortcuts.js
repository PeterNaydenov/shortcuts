'use strict'
/**
 * @typedef {object} contextShortcuts
 * @property {string} context - Context name
 * @property {string[]} shortcuts - List of shortcuts in a context
 */



function listShortcuts ( dependencies, state ) {
const shortcuts = state.shortcuts;
/**
 *  @function listShortcuts
 *  @description List all shortcuts in all contexts or in a specific context.
 *  @param {string}[ contextName=null]  - List of shortcuts for provided context name. (optional)
 *  @returns {string[]|contextShortcuts[]} - List of shortcuts for a specified context or list of contextShortcuts for all contexts.
 */
return function listShortcuts ( contextName=null ) {
    
    // Create a list of shortcuts for a specific context:
    if ( contextName != null ) {
                let context = shortcuts[contextName];
                if ( context == null )   return null
                return Object.entries ( context ).map ( ([shortcut, callbacks]) => shortcut )
        }

    // Create a list of allShortcuts for each context:
    return  Object.keys ( shortcuts ).map ( contextName => {
                        let result = {};
                        result['context'] = contextName
                        result['shortcuts'] = Object.entries ( shortcuts[contextName] ).map ( ([shortcut, callbacks]) => shortcut   )
                        return result
            }) // map

}} // listShortcuts func.



export default listShortcuts


