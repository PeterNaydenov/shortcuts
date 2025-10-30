'use strict'



function _listenDOM ( dependencies, state ) {
        const { ev } = dependencies;
        let timeout = null; 

        function setupData ( dependencies, state, event, type) {
                return {
                          target : event.target
                          // TODO: Find if is possible to add some size and positioning data
                        , context : state.currentContext.name
                        , note    : state.currentContext.note
                        , event   
                        , dependencies : dependencies.mainDependencies.extra
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
            } // stop func.

        return { start, stop }
} // _listenDOM func.



export default _listenDOM


