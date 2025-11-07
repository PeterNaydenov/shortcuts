'use strict'

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


