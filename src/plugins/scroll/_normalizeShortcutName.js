'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /SCROLL\s*\:/i
                , isHoverShortcut = regex.test ( upperCase )
                ;   
                
            const sliceIndex = upperCase.indexOf ( ':' );

            if ( !isHoverShortcut )   return name
            const shortcut = upperCase.slice(sliceIndex+1).trim ()                            
            return `SCROLL:${shortcut}` 
} // _normalizeShortcutName func.



export default _normalizeShortcutName


