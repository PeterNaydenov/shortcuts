'use strict'

/**
 * @function _findTarget
 * @description Find the appropriate click target element by checking if element has any of the target attributes
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions with clickTarget array
 * @param {Element} target - DOM element to start searching from
 * @returns {Element|null} - Target element or null if not found
 */
function _findTarget ( dependencies, state, target ) {
    const { listenOptions : {clickTarget}} = state;

    const t = target;
    if ( t === document.body )   return null

    const found = clickTarget.some ( attr => ( t.hasAttribute ( attr ) ) )
    if ( found ) return t
    return   _findTarget ( dependencies, state, t.parentNode ) 
} // _findTarget func.



export default _findTarget


