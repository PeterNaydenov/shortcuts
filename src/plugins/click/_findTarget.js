'use strict'

/**
 * @function _findTarget
 * @description Find the appropriate click target element
 * @param {Object} dependencies - Dependencies object
 * @param {Object} state - Plugin state containing listenOptions
 * @param {Element} target - DOM element to start searching from
 * @returns {Element|null} - Target element or null if not found
 */
function _findTarget ( dependencies, state, target ) {
    const { listenOptions : {clickTarget}} = state;

    let t = target;
    if ( t === document.body )   return null

    if ( t.dataset[clickTarget] ) return t
    if ( t.nodeName === 'A'     ) return t
    return   _findTarget ( dependencies, state, t.parentNode ) 
} // _findTarget func.



export default _findTarget


