'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /HOVER\s*\:/i
                , isHoverShortcut = regex.test ( upperCase )
                ;   
                
            let sliceIndex = upperCase.indexOf ( ':' );

            if ( !isHoverShortcut )   return name
            let shortcut = upperCase.slice(sliceIndex+1).trim ()                            
            return `HOVER:${shortcut}` 
} // _normalizeShortcutName func.



export default _normalizeShortcutName


