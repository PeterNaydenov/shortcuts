'use strict'


/**
 * @function _listenDOM
 * @description Set up DOM event listeners for click events
 * @param {Object} dependencies - Dependencies object containing ev, _findTarget, _readClickEvent, extra, resetState
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 */
function _listenDOM ( dependencies, state ) {
        const { 
                   ev
                , _findTarget 
                , _readClickEvent
                , extra
                , resetState
                        } = dependencies
        const { listenOptions, currentContext } = state

        let 
             mouseTarget = null // Dom element or null
           , mouseDomEvent = null
           , mouseTimer = null  // Timer for mouse sequence or null
           , mouseIgnore = null // Timer for ignoring mouse clicks or null
           , count    = 0
           ;

        function mouseSequenceEnd () {   // Execute when mouse sequence ends
                        if ( !mouseTarget ) return  // No valid target found                        
                        let 
                                { left, top, width, height } = mouseTarget.getBoundingClientRect ()
                              , scrollX = window.scrollX
                              , scrollY = window.scrollY
                              ;
                        const
                                  mouseEvent = _readClickEvent ( mouseDomEvent, count )
                                , data = {
                                          target : mouseTarget
                                        , x       : mouseDomEvent.clientX
                                        , y       : mouseDomEvent.clientY
                                        , context : currentContext.name
                                        , note    : currentContext.note
                                        , event   : mouseDomEvent
                                        , dependencies : extra
                                        , viewport : {                                    // Viewport scroll positions and sizes
                                                          X:scrollX
                                                        , Y:scrollY 
                                                        , width:window.innerWidth
                                                        , height:window.innerHeight
                                                }
                                        , sizes    : { width, height }                     // Element sizes
                                        , position : { x:left, y:top }                     // Position relative to viewport
                                        , pagePosition : { x:left+scrollX, y:top+scrollY } // Position relative to page
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
                        let targetMax = state.maxLeftClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, listenOptions.mouseWait )
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
                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, listenOptions.mouseWait )
                                    return
                            }
                        mouseTimer = setTimeout ( mouseSequenceEnd, listenOptions.mouseWait )
            } // listenLeftClick func.



        function listenRightClick ( event ) {
                        let targetMax = state.maxRightClicks;  // Maximum number of clicks per target
                        clearTimeout ( mouseTimer )
                        if ( mouseIgnore ) {
                                    clearTimeout ( mouseIgnore )
                                    mouseIgnore = setTimeout ( () => mouseIgnore=null, listenOptions.mouseWait )
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
                                    if ( targetMax > 1 )   mouseIgnore = setTimeout ( () => mouseIgnore=null, listenOptions.mouseWait )
                                    return
                            }
                        mouseTimer = setTimeout ( mouseSequenceEnd, listenOptions.mouseWait )
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
                        
                        if ( mouseIgnore ) {
                                clearTimeout ( mouseIgnore )
                                mouseIgnore = null
                            }
                        // Reset all state variables to prevent pollution between tests
                        mouseTarget = null
                        mouseDomEvent = null
                        count = 0
                } // stop func.
                
        return { start, stop }
} // _listenDOM func.



export default _listenDOM


