'use strict'

function _findTarget ( dependencies, state ) {
const { listenOptions : {clickTarget}} = state;
return function _findTarget ( target ) {
    let t = target;
    while ( !t.dataset[clickTarget] && t.nodeName !== 'A' ) {
            t = t.parentNode;
            if ( t === document      )   return null
            if ( t === document.body )   return null
        }
    return t
}} // _findTarget func.



export default _findTarget


