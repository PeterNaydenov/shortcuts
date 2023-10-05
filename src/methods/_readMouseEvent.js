'use strict'

function _readMouseEvent () {
return function _readMouseEvent ( event, count ) {
    let
          { shiftKey, altKey, ctrlKey, key, button } = event
        , mouseNames = [ 'LEFT', 'MIDDLE', 'RIGHT' ]
        , mouseEvent = `MOUSE-CLICK-${mouseNames[button]}-${count}`
        , res = []
        ;
    
    res.push ( mouseEvent )
    if ( ctrlKey )   res.push ( 'CTRL' )
    if ( shiftKey )  res.push ( 'SHIFT' )
    if ( altKey )    res.push ( 'ALT' )

    return res.sort ()
}} // _readMouseEvent func.



export default _readMouseEvent


