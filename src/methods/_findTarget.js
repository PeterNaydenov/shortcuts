'use strict'

function _findTarget ( dependencies, state ) {
return function _findTarget ( target, dataName ) {
    let t = target
    while ( t && !t.dataset[dataName] ) {
            t = t.parentNode;
            if ( t === document      )   return null
            if ( t === document.body )   return null
        }
    return t
}} // _findTarget func.



export default _findTarget


