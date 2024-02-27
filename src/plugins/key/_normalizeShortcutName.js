'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , isKeyboardShortcut = upperCase.includes ('KEY:')
                ;

            if ( !isKeyboardShortcut )   return name
            let shortcut = upperCase
                               .slice(4)
                               .split(',')
                               .map ( key => key.trim() )
                               .map ( key => {
                                            return key
                                                     .split ( '+' )
                                                     .map ( key => key.trim() )
                                                     .sort()
                                                     .join ( '+' )
                                        })
                               .join(',');
            return `KEY:${shortcut}`   
} // _normalizeShortcutName func.



export default _normalizeShortcutName


