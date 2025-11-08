'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /HOVER\s*\:/i
                , isHoverShortcut = regex.test ( upperCase )
                ;   
                
            const sliceIndex = upperCase.indexOf ( ':' );

            if ( !isHoverShortcut )   return name
            const shortcut = upperCase.slice(sliceIndex+1).trim ()                            
            return `HOVER:${shortcut}` 
} // _normalizeShortcutName func.



export default _normalizeShortcutName


