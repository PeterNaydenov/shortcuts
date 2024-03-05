'use strict'

function _readClickEvent ( event, count ) {
    let
          { shiftKey, altKey, ctrlKey, key, button } = event
        , mouseNames = [ 'LEFT', 'MIDDLE', 'RIGHT' ]
        , mouseEvent = `CLICK:${mouseNames[button]}-${count}`
        , mods = []
        ;
    
    // res.push ( mouseEvent )
    if ( ctrlKey )   mods.push ( 'CTRL' )
    if ( shiftKey )  mods.push ( 'SHIFT' )
    if ( altKey )    mods.push ( 'ALT' )

    if ( mods.length > 0 )   return `${mouseEvent}${mods.length>0?'-':''}${mods.sort().join('-')}`
    else                     return `${mouseEvent}`
} // _readClickEvent func.



export default _readClickEvent


