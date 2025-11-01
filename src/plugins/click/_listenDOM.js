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
                        if ( !mouseTarget ) return  // No valid target found

                        const
                                  mouseEvent = _readClickEvent ( mouseDomEvent, count )
                                , data = {
                                          target : mouseTarget
                                        , targetProps : mouseTarget.getBoundingClientRect()
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
                        mouseIgnore = null  // Timeout timer or null. Ignore mouse clicks until timer expires
                        mouseTarget = null
                        mouseDomEvent = null
                        count = 0
                } // mouseSequenceEnd func.



        function listenLeftClick ( event ) {
                        let targetMax = listenOptions.maxLeftClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTarget = _findTarget ( dependencies, state, event.target )
                        if ( mouseTarget == null )   return
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
                        let targetMax = listenOptions.maxRightClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, mouseWait )
                                    return
                            }
                        mouseTarget = _findTarget ( dependencies, state, event.target )
                        if ( mouseTarget == null )   return
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
                        // Clear any pending timers to prevent state pollution between tests
                        if ( mouseTimer ) {
                                clearTimeout ( mouseTimer )
                                mouseTimer = null
                        }
                        if ( mouseIgnore ) {
                                clearTimeout ( mouseIgnore )
                                mouseIgnore = null
                        }
                        count = 0
                } // stop func.
                
        return { start, stop }
} // _listenDOM func.



export default _listenDOM


