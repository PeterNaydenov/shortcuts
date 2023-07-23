'use strict'


function findTarget ( target, dataName ) {
    let t = target
    while ( t && !t.dataset[dataName] ) {
            t = t.parentNode;
            if ( t === document      )   return null
            if ( t === document.body )   return null
        }
    return t
} // findTarget func.



export default findTarget


