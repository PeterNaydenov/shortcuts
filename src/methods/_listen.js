'use strict'
function _listen ( dependencies, state ) {
// Listen for input signals and generate event titles
return function _listen () {   
    const { 
                ev
              , inAPI : {
                          _findTarget
                        , _specialChars
                        , _readKeyEvent
                        , _readMouseEvent
                    }
            } = dependencies
        , {
                  exposeShortcut
                , currentContext
                , streamKeys
                , listenOptions
            } = state
        , {
                  mouseWait
                , keyWait
                , clickTarget
                , listenFor  
            } = listenOptions
        ;
    
    let 
          r = []
        , mouseTarget = null // Dom element or null
        , mouseDomEvent = null
        , keyTimer = null    // Timer for key sequence or null
        , mouseTimer = null  // Timer for mouse sequence or null
        , mouseIgnore = null // Timer for ignoring mouse clicks or null
        , sequence = true
        , ignore   = false   // Use to trigger a single callback without adding the key to the sequence.
        , count    = 0
        ;
    



    const  
           waitKeys   = () => sequence = false  
        ,  endKeys    = () => sequence = true  
        , ignoreKeys  = () => ignore   = true
        , waitingKeys = () => sequence === false
        ;
    


    function keySequenceEnd () {   // Execute when key sequence ends
                    let res =  r.map ( x => ([x.join('+')])   );
                    if ( !sequence ) {
                            let signal = res.at(-1);
                            ev.emit ( signal, { wait:waitKeys, end:endKeys, ignore:ignoreKeys, isWaiting:waitingKeys, note: currentContext.note, context: currentContext.name })
                            if ( ignore ) {
                                        res = res.slice ( 0, -1 )
                                        ignore = false
                                }
                        }
                    const data = {
                                      wait: waitKeys
                                    , end:endKeys
                                    , ignore:ignoreKeys
                                    , isWaiting:waitingKeys
                                    , note: currentContext.note
                                    , context: currentContext.name
                                    , dependencies : dependencies.extra
                            };
                    if ( sequence ) { 
                            ev.emit ( res.join(','), data )   
                            if ( exposeShortcut )   exposeShortcut ({ shortcut:res.join(','), context: currentContext.name, note:currentContext.note, dependencies:dependencies.extra }) // TODO: Add a context information...?
                            // Reset:
                            r = []
                            keyTimer = null
                        }
        } // keySequeceEnd func.



    function mouseSequenceEnd () {   // Execute when mouse sequence ends
                    const 
                          mouseEvent = _readMouseEvent ( mouseDomEvent, count )
                        , data = { 
                                  target : mouseTarget
                                , targetProps : mouseTarget ? mouseTarget.getBoundingClientRect() : null
                                , x       : mouseDomEvent.clientX
                                , y       : mouseDomEvent.clientY
                                , context : currentContext.name
                                , note    : currentContext.note
                                , event   : mouseDomEvent
                                , dependencies : dependencies.extra
                            }
                        ;
                    ev.emit ( mouseEvent.join('+'), data )
                    if ( exposeShortcut )   exposeShortcut ({ shortcut: mouseEvent.join('+'), context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                    // Reset:
                    mouseTimer = null
                    mouseIgnore = null
                    mouseTarget = null
                    mouseDomEvent = null
                    count = 0
        } // mouseSequenceEnd func.



    function listenMouse () {
                        window.addEventListener ( 'contextmenu', event => {   // Listen for right mouse clicks
                                        let targetMax = listenOptions.maxClicks;  // Maximum number of clicks per target
                                        event.preventDefault ()
                                        clearTimeout ( mouseTimer )
                                        if ( mouseIgnore ) {
                                                    clearTimeout ( mouseIgnore )
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        mouseTarget = _findTarget ( event.target )
                                        if ( mouseTarget && mouseTarget.dataset.hasOwnProperty('quickClick'))   targetMax = 1
                                        mouseDomEvent = event
                                        count++
                                        if ( count >= targetMax ) {  
                                                    mouseSequenceEnd ()
                                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })

                        document.addEventListener ( 'click', event => {  // Listen for left and middle mouse clicks
                                        let targetMax = listenOptions.maxClicks;  // Maximum number of clicks per target
                                        event.preventDefault ()
                                        clearTimeout ( mouseTimer )
                                        if ( mouseIgnore ) {
                                                    clearTimeout ( mouseIgnore )
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        mouseTarget = _findTarget ( event.target )
                                        if ( mouseTarget && mouseTarget.dataset.hasOwnProperty('quickClick'))   targetMax = 1
                                        mouseDomEvent = event
                                        count++
                                        if ( count >= targetMax ) {
                                                    mouseSequenceEnd ()
                                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })
        } // listenMouse func.



    function listenKeyboard () {
                        document.addEventListener ( 'keydown', event => {   // Listen for special keyboard keys
                                        clearTimeout ( keyTimer )
                                        if ( _specialChars.hasOwnProperty(event.code) )   r.push ( _readKeyEvent ( event, _specialChars ))
                                        else                                             return
                                        if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                                        if ( listenOptions.keyIgnore ) {
                                                    clearTimeout ( listenOptions.keyIgnore )
                                                    listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                                                    return 
                                            }
                                        if ( sequence && r.length === listenOptions.maxSequence ) {                                                    
                                                    keySequenceEnd ()
                                                    listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                                                    return
                                            }
                                        if ( sequence   )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else                keySequenceEnd ()
                                })

                        document.addEventListener ( 'keypress', event => {  // Listen for regular keyboard keys
                                        if ( _specialChars.hasOwnProperty(event.code) )   return            
                                        clearTimeout ( keyTimer )
                                        if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                                        if ( listenOptions.keyIgnore ) {
                                                    clearTimeout ( listenOptions.keyIgnore )
                                                    listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                                                    return 
                                            }
                                        r.push ( _readKeyEvent ( event, _specialChars ))
                                        if ( sequence && r.length === listenOptions.maxSequence ) {
                                                    keySequenceEnd ()
                                                    listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                                                    return
                                            }
                                        if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else              keySequenceEnd ()
                                })
        } // listenKeyboard func.
    
    

    if ( listenFor.includes('mouse')    )   listenMouse ()
    if ( listenFor.includes('keyboard') )   listenKeyboard ()

}} // _listen func.



export default _listen


