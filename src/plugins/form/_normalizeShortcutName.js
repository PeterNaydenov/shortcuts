'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /FORM\s*\:/i
                , isKeyboardShortcut = regex.test ( upperCase )
                , sliceIndex = upperCase.indexOf ( ':' )
                ;

            if ( !isKeyboardShortcut )   return name
            const shortcut = upperCase.slice(sliceIndex+1).trim ()
                              
            return `FORM:${shortcut}`
} // _normalizeShortcutName func.



export default _normalizeShortcutName


