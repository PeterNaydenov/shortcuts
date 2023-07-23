'use strict'



function listen ( dependencies, options, currentContext ) {   // Listen for input signals and generate event titles
    const { 
              specialChars 
            , readKeyEvent
            , readMouseEvent
            , findTarget
            , ev
            , exposeShortcut
        } = dependencies
        , { 
                  mouseWait
                , maxClicks
                , keyWait
                , maxSequence 
                , clickTarget
                , listenFor
            } = options
        ;
    let 
          r = []
        , mouseButton = null // 0 - left, 1 - middle, 2 - right
        , mouseTarget = null // Dom element or null
        , mouseDomEvent = null
        , timer = null       // Timer for mouse sequence or null
        , keyTimer = null    // Timer for key sequence or null
        , mouseTimer = null  // Timer for mouse sequence or null
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
                            ev.emit ( signal, { wait:waitKeys, end:endKeys, ignore:ignoreKeys, isWaiting:waitingKeys, note: currentContext.note })
                            // TODO: Stream the signal - call the callback function with the signal as an argument.
                            if ( ignore ) {
                                        res = res.slice ( 0, -1 )
                                        ignore = false
                                }
                        }

                    if ( sequence ) { 
                            ev.emit ( res.join(','), { wait: waitKeys, end:endKeys, ignore:ignoreKeys, isWaiting:waitingKeys, note: currentContext.note })   
                            if ( exposeShortcut )   exposeShortcut ( res.join(','), currentContext.name, currentContext.note ) // TODO: Add a context information...?
                            // Reset:
                            r = []
                            keyTimer = null
                        }
        } // keySequeceEnd func.



    function mouseSequenceEnd () {   // Execute when mouse sequence ends
                    const mouseEvent = readMouseEvent ( mouseDomEvent, count );
                    
                    ev.emit ( mouseEvent.join('+'), { target : mouseTarget })
                    console.log ( mouseDomEvent )
                    if ( exposeShortcut )   exposeShortcut ( mouseEvent.join('+'), currentContext.name, currentContext.note )
                    // Reset:
                    mouseTimer = null
                    mouseTarget = null
                    mouseDomEvent = null
                    mouseButton = null
                    count = 0
        } // mouseSequenceEnd func.



    function listenMouse () {
                        window.addEventListener ( 'contextmenu', event => {   // Listen for right mouse clicks
                                        clearTimeout ( timer )
                                        mouseButton = event.button
                                        event.preventDefault ()
                                        mouseTarget = findTarget (event.target, clickTarget )
                                        mouseDomEvent = event
                                        count++
                                        timer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })

                        document.addEventListener ( 'click', event => {  // Listen for left and middle mouse clicks
                                        clearTimeout ( timer )
                                        mouseButton = event.button
                                        mouseTarget = findTarget ( event.target, clickTarget )
                                        mouseDomEvent = event
                                        count++
                                        timer = setTimeout ( mouseSequenceEnd, mouseWait )
                                })
        } // listenMouse func.



    function listenKeyboard () {
                        document.addEventListener ( 'keydown', event => {   // Listen for special keyboard keys
                                        clearTimeout ( keyTimer )
                                        if ( specialChars.hasOwnProperty(event.code) )   r.push ( readKeyEvent ( event, specialChars ))
                                        else return
                                        // TODO: Stream keyboard ( event.key ) if streaming exists
                                        if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else              keySequenceEnd ()
                                })

                        document.addEventListener ( 'keypress', event => {  // Listen for regular keyboard keys
                                        if ( specialChars.hasOwnProperty(event.code) )   return            
                                        clearTimeout ( keyTimer )
                                        // TODO: Stream keyboard ( event.key ) if streaming exists
                                        r.push ( readKeyEvent ( event, specialChars ))
                                        if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                                        else              keySequenceEnd ()
                                })
        } // listenKeyboard func.
    
    

    if ( listenFor.includes('mouse')    )   listenMouse ()
    if ( listenFor.includes('keyboard') )   listenKeyboard ()

} // listen func.



export default listen


