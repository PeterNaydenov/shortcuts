
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

        if ( inside( hoverRectangle, x, y ) )   return
        const data = {
                      target
                    , context: state.currentContext.name
                    , note   : state.currentContext.note
                    , event
                    , dependencies : extra
                    , type: 'hover'
                }
        if ( target !== hovered ) {
                    if ( hovered ) {
                            state.hovered = false
                            state.hoverRectangle = null

                            if ( hoverTimer ) {
                                    clearTimeout ( hoverTimer )
                                    state.hoverTimer = null
                                    return
                                }
                            if ( lastEvent === 'off' )  return
                            state.leaveTimer = setTimeout ( () => {
                                                ev.emit ( 'HOVER:OFF', data )
                                                state.leaveTimer = null
                                                state.lastEvent = 'off'
                                            }, listenOptions.wait )
                            return
                        } // if hovered

                    clearTimeout ( leaveTimer )
                    clearTimeout ( hoverTimer )
                                        
                    state.hovered = target
                    state.hoverRectangle = target.getBoundingClientRect ()

                    if ( target ) {
                            if ( lastEvent === 'on' && lastHoverTarget === target )  return
                            state.hoverTimer = setTimeout ( () => {
                                                ev.emit ( 'HOVER:ON', data)
                                                state.hoverTimer = null
                                                state.lastHoverTarget = target
                                                state.lastEvent = 'on'
                                            }, listenOptions.wait )
                        } // if target
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


