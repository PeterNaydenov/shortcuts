'use strict'

/**
 * @function _findTarget
 * @description Find the appropriate hover target element by checking if element has any of the target attributes
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions with hoverTarget array
 * @param {Node|null} target - DOM node to start searching from
 * @returns {Element|false} - Target element or false if not found
 */
function _findTarget ( dependencies, state, target ) {
    const { listenOptions : {hoverTarget}} = state;

    const t = target;
    if ( !t || t === document.body || t.nodeType !== 1 )   return false   // Stop at <body>, <html> parent (document) or non-element nodes
    const found = hoverTarget.some ( attr => ( t.hasAttribute ( attr ) ) )
    if ( found ) return t
    return   _findTarget ( dependencies, state, t.parentNode ) 
} // _findTarget func.



export default _findTarget


