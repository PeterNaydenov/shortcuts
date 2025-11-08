'use strict'

/**
 * @function _normalizeShortcutName
 * @description Normalize click shortcut name to standard format
 * @param {string} name - Raw shortcut name
 * @returns {string} - Normalized shortcut name
 */
function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , regex = /CLICK\s*\:/i
                , isClickShortcut = regex.test(upperCase)
                , mouseNames = [ 'LEFT', 'MIDDLE', 'RIGHT' ]
                , modifiers = [ 'ALT', 'SHIFT', 'CTRL' ]
                ;   
            let
                  btn = null
                , counter = 0
                ; const usedModifiers = []
                , sliceIndex = upperCase.indexOf ( ':' )
                ;

            // Click event format: CLICK:LEFT-2-ALT-SHIFT-CTRL

            if ( !isClickShortcut            )   return name
            if ( upperCase.includes('SETUP') )   return 'CLICK:SETUP'
            const shortcutArray = upperCase.slice(sliceIndex+1).trim().split('-').map ( x => x.trim() );
            shortcutArray.forEach ( item => {
                        if ( mouseNames.includes ( item )) { 
                                btn = item
                                return
                            }
                        if ( modifiers.includes ( item )) { 
                                usedModifiers.push ( item )
                                return
                            }
                        if ( !isNaN ( item )) { 
                                counter = item
                                return
                            }
                    }) // forEach
                    
            return `CLICK:${btn}-${counter}${usedModifiers.length>0?'-':''}${usedModifiers.sort().join('-')}` 
} // _normalizeShortcutName func.



export default _normalizeShortcutName


