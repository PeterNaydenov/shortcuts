

function _listenDOM ( dependencies, state ) {
    const { ev, resetState, mainDependencies } = dependencies;
    let 
          waitForScroll = null    // Timeout for reducing scroll events 
        , waitForEndScroll = null // Timeout for setting scroll end event
        ;

function listenForScroll ( event ) {
        const
              x = event.clientX
            , y = event.clientY
            , {
                    lastPosition
                  , lastDirection
                  , listenOptions
                  , currentContext
                } = state
            , {
                      scrollWait
                    , endScrollWait
                    , minSpace
                } = listenOptions
            ;

        

        if ( !lastPosition ) return; // No previous position to compare

        let direction = null;

        let
              currentX = window.scrollX
            , currentY = window.scrollY
            , verticalChange   = Math.abs ( currentY - lastPosition.y )
            ;

        // Reduce scroll events by space
        if ( verticalChange < minSpace )   return
        if ( currentY > lastPosition.y )   direction = 'down'
        else                               direction = 'up'

        const getData = () => ({
                          x: currentX
                        , y: currentY
                        , direction
                        , context: currentContext.name
                        , note: currentContext.note
                        , dependencies: dependencies.mainDependencies.extra
                        , type: 'scroll'
                    })

        const signal = `SCROLL:${direction.toUpperCase()}`
        clearTimeout ( waitForScroll )
        clearTimeout ( waitForEndScroll )
        waitForScroll    = setTimeout ( () => ev.emit ( signal      , getData() ), scrollWait )
        waitForEndScroll = setTimeout ( () => ev.emit ( 'SCROLL:END', getData() ), endScrollWait )

        // Update last position
        state.lastPosition = { x: currentX, y: currentY }
        state.lastDirection = direction

    } // listenForScroll func.


function start () {
        if ( state.active ) return
        // Initialize last position
        state.lastPosition = { x: window.scrollX, y: window.scrollY }
        window.addEventListener ( 'scroll' , listenForScroll )
        state.active = true
    }


function stop () {
        if ( !state.active ) return
        window.removeEventListener ( 'scroll' , listenForScroll )
        resetState ()
    }

return { start, stop }

} // _listenDOM func.



export default _listenDOM


