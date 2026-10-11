'use strict'

/**
 * @function listShortcuts
 * @description List shortcuts in all contexts or in a specific context
 * @param {import('../types.js').LibDependencies} dependencies - Library dependencies
 * @param {import('../types.js').LibState} state - State object containing shortcuts
 * @returns {function} - Returns a function that lists shortcuts
 */
function listShortcuts ( dependencies, state ) {
const shortcuts = state.shortcuts;
/**
 *  @function listShortcuts
 *  @description List all shortcuts in all contexts or in a specific context
 *  @param {string|null} [contextName=null] - List of shortcuts for provided context name (optional)
 *  @returns {string[]|import('../types.js').ContextShortcuts[]|null} - List of shortcuts for a specified context, list of contextShortcuts for all contexts, or null if context doesn't exist
 */
return function listShortcuts ( contextName=null ) {
    
    // Create a list of shortcuts for a specific context:
    if ( contextName != null ) {
                const context = shortcuts[contextName];
                if ( context == null )   return null
                return Object.entries ( context ).map ( ([shortcut, callbacks]) => shortcut )
        }

    // Create a list of allShortcuts for each context:
    return  Object.keys ( shortcuts ).map ( contextName => {
                        const result = {};
                        result['context'] = contextName
                        result['shortcuts'] = Object.entries ( shortcuts[contextName] ).map ( ([shortcut, callbacks]) => shortcut   )
                        return result
            }) // map

}} // listShortcuts func.



export default listShortcuts


