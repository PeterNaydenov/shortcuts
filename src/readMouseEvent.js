'use strict'


function readMouseEvent ( event, count ) {
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
} // readMouseEvent func.



export default readMouseEvent


