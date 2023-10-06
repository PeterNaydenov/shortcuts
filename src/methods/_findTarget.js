'use strict'

function _findTarget ( dependencies, state ) {
const { listenOptions : {clickTarget}} = state;
return function _findTarget ( target ) {
    const t = target;
    if ( t === document      )   return null
    if ( t === document.body )   return null

    if ( t.dataset[clickTarget] ) return t
    if ( t.nodeName === 'A'     ) return t
    return   _findTarget ( t.parentNode ) 
}} // _findTarget func.



export default _findTarget


