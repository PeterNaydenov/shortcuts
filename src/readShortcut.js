'use strict'
// [ crtl+s, shift+alt+o]
function readShortcut ( txt ) {
        const r = txt
                    .split ( ',' )
                    .map ( (x) => x.trim() )
                    .map ( (x) => x.split ( '+' ).map(x => x.toUpperCase()).sort().join('+') )
                    .join ( ',' );
    return r
} // readShortcut func.



export default readShortcut


