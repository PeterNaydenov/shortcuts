

function _listenDOM ( dependencies, state ) {
    const { 
              ev
            , resetState
            , extra 
          } = dependencies;
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
            , horizontalChange = Math.abs ( currentX - lastPosition.x )
            ;

        // Reduce scroll events by space
        if ( verticalChange < minSpace && horizontalChange < minSpace )   return
        
        const directions = [];
        
        // Check vertical scroll
        if ( verticalChange >= minSpace ) {
                if ( currentY > lastPosition.y )   directions.push('down')
                else                               directions.push('up')
        }
        
        // Check horizontal scroll
        if ( horizontalChange >= minSpace ) {
                if ( currentX > lastPosition.x )   directions.push('right')
                else                               directions.push('left')
        }
        
        // Use first direction for single direction compatibility
        direction = directions[0] || null;

        const getData = (dir) => ({
                          x: currentX
                        , y: currentY
                        , direction: dir
                        , context: currentContext.name
                        , note: currentContext.note
                        , dependencies: extra
                        , options: state.listenOptions
                        , viewport : {                // Viewport scroll positions and sizes
                                  X: currentX
                                , Y: currentY
                                , width: window.innerWidth
                                , height: window.innerHeight
                            }
                        , type: 'scroll'
                })

        // Emit events for each direction detected
        directions.forEach(dir => {
                        const signal = `SCROLL:${dir.toUpperCase()}`
                        ev.emit ( signal, getData(dir) )
                })
        
        // Set up end scroll timeout (only once)
        clearTimeout ( waitForScroll )
        clearTimeout ( waitForEndScroll )
        const finalDirection = directions[directions.length - 1] || null
        waitForScroll    = setTimeout ( () => {}, scrollWait ) // Keep for compatibility
        waitForEndScroll = setTimeout ( () => ev.emit ( 'SCROLL:END', getData(finalDirection) ), endScrollWait )

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


