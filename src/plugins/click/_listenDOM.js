'use strict'


function _listenDOM ( dependencies, state ) {
        const { 
                   ev
                , _findTarget 
                , _readClickEvent
                , mainDependencies
                        } = dependencies
        const { listenOptions, currentContext } = state
        const { mouseWait } = listenOptions

        let 
             mouseTarget = null // Dom element or null
           , mouseDomEvent = null
           , mouseTimer = null  // Timer for mouse sequence or null
           , mouseIgnore = null // Timer for ignoring mouse clicks or null
           , count    = 0
           ;

        function mouseSequenceEnd () {   // Execute when mouse sequence ends
                        const 
                                  mouseEvent = _readClickEvent ( mouseDomEvent, count )
                                , data = { 
                                          target : mouseTarget
                                        , targetProps : mouseTarget ? mouseTarget.getBoundingClientRect() : null
                                        , x       : mouseDomEvent.clientX
                                        , y       : mouseDomEvent.clientY
                                        , context : currentContext.name
                                        , note    : currentContext.note
                                        , event   : mouseDomEvent
                                        , dependencies : mainDependencies.extra
                                        , type   : 'click'
                                }
                                ;

                        ev.emit ( mouseEvent, data )
                        // Reset:
                        mouseTimer = null
                        mouseIgnore = null
                        mouseTarget = null
                        mouseDomEvent = null
                        count = 0
                } // mouseSequenceEnd func.



        function listenLeftClick ( event ) {
                        let targetMax = listenOptions.maxClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTarget = _findTarget ( dependencies, state, event.target )
                        if ( mouseTarget && mouseTarget.dataset.hasOwnProperty('quickClick'))   targetMax = 1
                        if ( mouseTarget && mouseTarget.tagName === 'A'                     )   targetMax = 1
                        mouseDomEvent = event
                        count++
                        if ( count >= targetMax ) {
                                    mouseSequenceEnd ()
                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
            } // listenLeftClick func.



        function listenRightClick ( event ) {
                        let targetMax = listenOptions.maxClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTarget = _findTarget ( dependencies, state, event.target )
                        if ( mouseTarget && mouseTarget.dataset.hasOwnProperty('quickClick'))   targetMax = 1
                        if ( mouseTarget && mouseTarget.tagName === 'A'                     )   targetMax = 1
                        mouseDomEvent = event
                        count++
                        if ( count >= targetMax ) {  
                                    mouseSequenceEnd ()
                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTimer = setTimeout ( mouseSequenceEnd, mouseWait )
            } // listenRightClick func.



            
        function start () {
                        if ( state.active  )   return
                        window.addEventListener ( 'contextmenu', listenRightClick )
                        document.addEventListener ( 'click'      , listenLeftClick  )
                        state.active = true
                } // start func.

        function stop () {
                        if ( !state.active )   return
                        window.removeEventListener  ( 'contextmenu', listenRightClick )
                        document.removeEventListener ( 'click'      , listenLeftClick  )
                        state.active = false
                } // stop func.
                
        return { start, stop }
} // _listenDOM func.



export default _listenDOM


