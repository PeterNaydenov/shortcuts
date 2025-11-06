
/**
 * @function _listenDOM
 * @description Set up DOM event listeners for hover events
 * @param {Object} dependencies - Dependencies object containing ev, _findTarget, resetState, extra
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 * 
 * @typedef {Object} HoverEventData
 * @property {Element} target - The DOM element that is being hovered
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Event} event - The original DOM event
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 * @property {string} type - Event type ('hover')
 */
function _listenDOM ( dependencies, state ) {
    const { 
              ev
            , _findTarget
            , resetState
            , extra 
           } = dependencies;

    function inside ( rect,  x,  y ) {
        if ( !rect ) return false;
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          );
    } // inside func.



function listenForHover ( event ) {
        const
            x = event.clientX
          , y = event.clientY
          ;
        
        let 
              { 
                  hovered
                , hoverRectangle
                , listenOptions
                , hoverTimer
                , leaveTimer
                , lastEvent
                , lastHoverTarget 
                } = state
            , target = _findTarget ( dependencies, state, event.target )
            ;

        if ( inside ( hoverRectangle, x, y ) )   return

        function  getData (tg) {
                    let 
                          { left, top, width, height } = tg.getBoundingClientRect ()
                        , scrollX = window.scrollX
                        , scrollY = window.scrollY
                        ;

                    return {
                                target : tg
                                , context: state.currentContext.name
                                , note   : state.currentContext.note
                                , event
                                , dependencies : extra
                                , options : state.listenOptions
                                , viewport : {                                    // Viewport scroll positions
                                        X:scrollX
                                        , Y:scrollY
                                        , width : window.innerWidth
                                        , height : window.innerHeight 
                                    }
                                , sizes : { width, height }                        // Element sizes
                                , position : { x:left, y:top }                     // Position relative to viewport
                                , pagePosition : { x:left+scrollX, y:top+scrollY } // Position relative to page
                                , type: 'hover'
                        }
                } // getData func.
        

        
        if ( target !== hovered ) {  // When target is different from hovered
                    if ( hovered && !target ) { // We have 'hovered' but no new target
                            state.hovered = false
                            state.hoverRectangle = null

                            if ( hoverTimer ) {
                                    clearTimeout ( hoverTimer )
                                    state.hoverTimer = null
                                }
                            if ( lastEvent === 'off' )  return
                            state.leaveTimer = setTimeout ( () => {
                                                ev.emit ( 'HOVER:OFF', getData(hovered) )
                                                state.leaveTimer = null
                                                state.lastEvent = 'off'
                                            }, listenOptions.wait )
                            return
                        } // if hovered

                    if ( hovered ) {   // We have 'hovered' and new target
                            // Close immediately the previous hover
                            ev.emit ( 'HOVER:OFF', getData(hovered) ) 
                            state.leaveTimer = null
                            state.lastEvent = 'off'
                        }
                    
                    clearTimeout ( leaveTimer )
                    clearTimeout ( hoverTimer )
                                        
                    state.hovered = target
                    state.hoverRectangle = target.getBoundingClientRect ()
                    state.hoverTimer = setTimeout ( () => {
                                                    ev.emit ( 'HOVER:ON', getData(target))
                                                    state.hoverTimer = null
                                                    state.lastHoverTarget = target
                                                    state.lastEvent = 'on'
                                            }, listenOptions.wait )

            } // if target !== hovered
    } // listenForHover func.


function start () {
        if ( state.active ) return
        document.addEventListener ( 'mousemove' , listenForHover )
        state.active = true
    }


function stop () {
        if ( !state.active ) return
        document.removeEventListener ( 'mousemove' , listenForHover )
        resetState ()
    }

return { start, stop }

} // _listenDOM func.



export default _listenDOM


