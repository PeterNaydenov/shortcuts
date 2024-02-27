'use strict'

function _normalizeShortcutName ( name ) {
            const 
                  upperCase = name.toUpperCase ()
                , isClickShortcut = upperCase.includes ('CLICK:')
                , mouseNames = [ 'LEFT', 'MIDDLE', 'RIGHT' ]
                , modifiers = [ 'ALT', 'SHIFT', 'CTRL' ]
                ;   
            let
                  btn = null
                , usedModifiers = []
                , counter = 0
                ;

            // Click event format: CLICK:LEFT-2-ALT-SHIFT-CTRL

            if ( !isClickShortcut )   return name
            let shortcutArray = upperCase.slice(6).split('-');
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


