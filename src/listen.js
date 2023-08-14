'use strict'



function listen ( dependencies, options, currentContext ) {   // Listen for input signals and generate event titles
    const { 
              specialChars 
            , readKeyEvent
            , readMouseEvent
            , findTarget
            , ev
            , exposeShortcut
            , streamKeys
        } = dependencies
        , { 
                  mouseWait
                , keyWait
                , clickTarget
                , listenFor
            } = options
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

                    if ( sequence ) { 
                            ev.emit ( res.join(','), { wait: waitKeys, end:endKeys, ignore:ignoreKeys, isWaiting:waitingKeys, note: currentContext.note, context: currentContext.name })   
                            if ( exposeShortcut )   exposeShortcut ( res.join(','), currentContext.name, currentContext.note ) // TODO: Add a context information...?
                            // Reset:
                            r = []
                            keyTimer = null
                        }
        } // keySequeceEnd func.



    function mouseSequenceEnd () {   // Execute when mouse sequence ends
                    const 
                          mouseEvent = readMouseEvent ( mouseDomEvent, count )
                        , data = { 
                                  target : mouseTarget
                                , targetProps : mouseTarget ? mouseTarget.getBoundingClientRect() : null
                                , x       : mouseDomEvent.clientX
                                , y       : mouseDomEvent.clientY
                                , context : currentContext.name
                                , note    : currentContext.note
                                , event   : mouseDomEvent
                            }
                        ;
                    ev.emit ( mouseEvent.join('+'), data )
                    if ( exposeShortcut )   exposeShortcut ( mouseEvent.join('+'), currentContext.name, currentContext.note )
                    // Reset:
                    mouseTimer = null
                    mouseIgnore = null
                    mouseTarget = null
                    mouseDomEvent = null
                    count = 0
        } // mouseSequenceEnd func.



    function listenMouse () {
                        window.addEventListener ( 'contextmenu', event => {   // Listen for right mouse clicks
                                        clearTimeout ( mouseTimer )
                                        if ( mouseIgnore ) {
                                                    clearTimeout ( mouseIgnore )
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        if ( count === options.maxClicks ) {  
                                                    mouseSequenceEnd ()
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        event.preventDefault ()
                                        mouseTarget = findTarget (event.target, clickTarget )
                                        mouseDomEvent = event
                                        count++
                                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })

                        document.addEventListener ( 'click', event => {  // Listen for left and middle mouse clicks
                                        clearTimeout ( mouseTimer )
                                        if ( mouseIgnore ) {
                                                    clearTimeout ( mouseIgnore )
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        if ( count === options.maxClicks ) {
                                                    mouseSequenceEnd ()
                                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                                    return
                                            }
                                        mouseTarget = findTarget ( event.target, clickTarget )
                                        mouseDomEvent = event
                                        count++
                                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })
        } // listenMouse func.



    function listenKeyboard () {
                        document.addEventListener ( 'keydown', event => {   // Listen for special keyboard keys
                                        clearTimeout ( keyTimer )
                                        if ( specialChars.hasOwnProperty(event.code) )   r.push ( readKeyEvent ( event, specialChars ))
                                        else                                             return
                                        if ( streamKeys )   streamKeys ( event.key, currentContext.name, currentContext.note )
                                        if ( options.keyIgnore ) {
                                                    clearTimeout ( options.keyIgnore )
                                                    options.keyIgnore = setTimeout ( () => options.keyIgnore=null, keyWait )
                                                    return 
                                            }
                                        if ( sequence && r.length === options.maxSequence ) {                                                    
                                                    keySequenceEnd ()
                                                    options.keyIgnore = setTimeout ( () => options.keyIgnore=null, keyWait )
                                                    return
                                            }
                                        if ( sequence   )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else                keySequenceEnd ()
                                })

                        document.addEventListener ( 'keypress', event => {  // Listen for regular keyboard keys
                                        if ( specialChars.hasOwnProperty(event.code) )   return            
                                        clearTimeout ( keyTimer )
                                        if ( streamKeys )   streamKeys ( event.key, currentContext.name, currentContext.note )
                                        if ( options.keyIgnore ) {
                                                    clearTimeout ( options.keyIgnore )
                                                    options.keyIgnore = setTimeout ( () => options.keyIgnore=null, keyWait )
                                                    return 
                                            }
                                        r.push ( readKeyEvent ( event, specialChars ))
                                        if ( sequence && r.length === options.maxSequence ) {
                                                    keySequenceEnd ()
                                                    options.keyIgnore = setTimeout ( () => options.keyIgnore=null, keyWait )
                                                    return
                                            }
                                        if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else              keySequenceEnd ()
                                })
        } // listenKeyboard func.
    
    

    if ( listenFor.includes('mouse')    )   listenMouse ()
    if ( listenFor.includes('keyboard') )   listenKeyboard ()

} // listen func.



export default listen


