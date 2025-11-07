'use strict'

/**
 * @function _findTarget
 * @description Find the appropriate hover target element by checking if element has any of the target attributes
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions with hoverTarget array
 * @param {Element} target - DOM element to start searching from
 * @returns {Element|false} - Target element or false if not found
 */
function _findTarget ( dependencies, state, target ) {
    const { listenOptions : {hoverTarget}} = state;

    let t = target;
    if ( t === document.body )   return false
    if ( t === document      )   return false
    const found = hoverTarget.some ( attr => ( t.hasAttribute ( attr ) ) )
    if ( found ) return t
    return   _findTarget ( dependencies, state, t.parentNode ) 
} // _findTarget func.



export default _findTarget


