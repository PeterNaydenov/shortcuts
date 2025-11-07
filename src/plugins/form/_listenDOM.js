'use strict'



/**
 * @function _listenDOM
 * @description Set up DOM event listeners for form events
 * @param {Object} dependencies - Dependencies object containing ev
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 * 
 * @typedef {Object} FormEventData
 * @property {Element} target - The DOM element that triggered the form event
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Event} event - The original DOM event
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 * @property {string} type - Event type ('form-in', 'form-out', 'form-instant')
 */
function _listenDOM ( dependencies, state ) {
        const { ev } = dependencies;
        let timeout = null; 

        function setupData ( dependencies, state, event, type) {
                const 
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
                        , options : state.listenOptions
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
                const fn = () => ev.emit ( key, prop, callbacks[key] )
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


