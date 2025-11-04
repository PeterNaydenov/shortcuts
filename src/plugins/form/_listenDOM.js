'use strict'



function _listenDOM ( dependencies, state ) {
        const { ev } = dependencies;
        let timeout = null; 

        function setupData ( dependencies, state, event, type) {
                let 
                      { left, top, width, height } = event.target.getBoundingClientRect ()
                    , scrollX = window.scrollX
                    , scrollY = window.scrollY
                    ;
                return {
                          target : event.target
                        , context : state.currentContext.name
                        , note    : state.currentContext.note
                        , event   
                        , dependencies : dependencies.extra
                        , viewport : {                                     // Viewport scroll positions and sizes
                                  X:scrollX
                                , Y:scrollY 
                                , width:window.innerWidth
                                , height:window.innerHeight
                            }
                        , sizes : { width, height }                        // Element sizes
                        , position : { x:left, y:top }                     // Position relative to viewport
                        , pagePosition : { x:left+scrollX, y:top+scrollY } // Position relative to page
                        , type
                    }
        } // setupData func.

        function listenFocusIn ( event ) { // Timing: in
                const 
                      { callbacks, typeFn } = state
                    , target = event.target
                    , prop = setupData ( dependencies, state, event, "form-in" )
                    , type = typeFn ( prop )
                    , key = `${type}/in`
                    ;
                if ( callbacks[key] == null )  return
                ev.emit ( key, prop, callbacks[key] )
           } // focusIn func.

        function listenFocusOut ( event ) {  // Timing: out
                const
                      { callbacks, typeFn } = state
                    , prop   = setupData ( dependencies, state, event, "form-out" )
                    , type   = typeFn ( prop )
                    , key    = `${type}/out`
                    ;
                if ( callbacks[key] == null )  return
                ev.emit ( key,  prop, callbacks[key] )
            } // focusOut func.


        function listenInput ( event ) {   // Timing: instant
                const 
                      { callbacks, typeFn } = state
                    , prop   = setupData ( dependencies, state, event, "form-instant" )
                    , type   = typeFn ( prop )
                    , wait   = state.wait[`${type}`]
                    , key    = `${type}/instant`
                    ;
                if ( callbacks[key] == null )  return
                if ( wait === 0 ) {
                        ev.emit ( key, prop, callbacks[key] )
                        return
                    }
                let fn = () => ev.emit ( key, prop, callbacks[key] )
                clearTimeout ( timeout )
                timeout = setTimeout ( fn, wait )
            } // input func.


        function start () {
                if ( state.active )  return
                document.addEventListener ( 'focusin', listenFocusIn );
                document.addEventListener ( 'focusout', listenFocusOut );
                document.addEventListener ( 'input', listenInput );
                state.active = true
            } // start func.


        function stop () {
                if ( !state.active ) return
                document.removeEventListener ( 'focusin', listenFocusIn );
                document.removeEventListener ( 'focusout', listenFocusOut );
                document.removeEventListener ( 'input', listenInput );
                state.active = false
                // Clear any pending timeout to prevent state pollution between tests
                if ( timeout ) {
                        clearTimeout ( timeout )
                        timeout = null
                }
            } // stop func.

        return { start, stop }
} // _listenDOM func.



export default _listenDOM


