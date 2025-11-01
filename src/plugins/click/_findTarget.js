'use strict'

function _findTarget ( dependencies, state, target ) {
    const { listenOptions : {clickTarget}} = state;

    let t = target;
    if ( t === document.body )   return null

    if ( t.dataset[clickTarget] ) return t
    if ( t.nodeName === 'A'     ) return t
    return   _findTarget ( dependencies, state, t.parentNode ) 
} // _findTarget func.



export default _findTarget


