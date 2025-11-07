'use strict'

function _readKeyEvent ( event, _specialChars ) {
    const
          { shiftKey, altKey, ctrlKey } = event
        , falseKeys = [ 'ControlLeft','ControlRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'Meta' ]
        , _sp = _specialChars ()
        , key = event.code
                     .replace ( 'Key', '' )
                     .replace('Digit','')
        , res = []
        ;
       
    if ( ctrlKey )   res.push ( 'CTRL' )
    if ( shiftKey )  res.push ( 'SHIFT' )
    if ( altKey )    res.push ( 'ALT' )

    if ( _sp.hasOwnProperty ( key )     )  res.push ( _sp[key].toUpperCase () )
    else if ( !falseKeys.includes(key)  )  res.push ( key.toUpperCase () )

    return res.sort ()
} // _readKeyEvent func.



export default _readKeyEvent


