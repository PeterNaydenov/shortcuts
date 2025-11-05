'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /KEY\s*\:/i
                , isKeyboardShortcut = regex.test ( upperCase )
                , sliceIndex = upperCase.indexOf ( ':' )
                ;
            
            if ( !isKeyboardShortcut       )   return name
            if ( upperCase === 'KEY:SETUP' )   return upperCase
            let shortcut = upperCase
                               .slice(sliceIndex+1)
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


