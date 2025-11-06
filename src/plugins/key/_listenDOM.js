'use strict'



/**
 * @function _listenDOM
 * @description Set up DOM event listeners for keyboard events
 * @param {Object} dependencies - Dependencies object containing ev, _specialChars, _readKeyEvent, extra, resetState
 * @param {Object} state - Plugin state containing listenOptions and currentContext
 * @returns {Object} - Object containing start and stop methods
 * 
 * @typedef {Object} KeyEventData
 * @property {Function} wait - Function to wait for keys (disables key sequence)
 * @property {Function} end - Function to end waiting for keys (enables key sequence)
 * @property {Function} ignore - Function to ignore the last key in sequence
 * @property {Function} isWaiting - Function to check if currently waiting for keys
 * @property {string|null} note - Current context note
 * @property {string} context - Current context name
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {string} type - Event type ('key')
 */
function _listenDOM ( dependencies, state ) {
// Listen for input signals and generate event titles
    const { 
                  ev
                , _specialChars
                , _readKeyEvent
                , extra
                , resetState
            } = dependencies
        , {
                  currentContext
                , streamKeys
                , listenOptions
            } = state
        ;
    
    let 
          r = []
        , keyTimer = null    // Timer for key sequence or null
        , sequence = true    // Is false only when time limitter is off - waitKeys ()
        , ignore   = false   // Use to trigger a single callback without adding the key to the sequence.
        ;


    
    const  
           waitKeys   = () => sequence = false  
        ,  endKeys    = () => sequence = true  
        , ignoreKeys  = () => ignore   = true
        , waitingKeys = () => sequence === false
        ;
    


    function keySequenceEnd () {   // Execute when key sequence ends
                    let res =  r.map ( x => ([x.join('+')])   )
                    
                    const data = {
                                      wait: waitKeys
                                    , end:endKeys
                                    , ignore:ignoreKeys
                                    , isWaiting:waitingKeys
                                    , note: currentContext.note
                                    , context: currentContext.name
                                    , dependencies : extra
                                    , options : state.listenOptions
                                    , viewport : { 
                                              X : window.scrollX
                                            , Y : window.scrollY
                                            , width:window.innerWidth
                                            , height:window.innerHeight 
                                        }
                                    , type : 'key'
                            };

                    if ( !sequence ) {
                             let signal = `KEY:${res.at(-1).join('+')}`;
                             ev.emit ( signal, data )
                             if ( ignore ) {
                                         r = r.slice ( 0, -1 )
                                         ignore = false
                                 }
                        }
                            
                    if ( sequence ) {
                            const signal = `KEY:${res.join(',')}`
                            ev.emit ( signal, data )
                            if ( ignore ) {
                                         r = r.slice ( 0, -1 )
                                         ignore = false
                                 }
                            // Reset:
                            r = []
                            clearTimeout ( state.keyIgnore )
                            state.keyIgnore = null
                            clearTimeout ( keyTimer )
                            keyTimer = null
                        }
        } // keySequeceEnd func.


    
    function listenForSpecialKeys ( event ) { // Listen for special keyboard keys
                clearTimeout ( keyTimer )
                let _sp = _specialChars ()
                if ( _sp.hasOwnProperty(event.code) )   r.push ( _readKeyEvent ( event, _specialChars ))
                else                                    return
                if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                if ( state.keyIgnore ) {
                            clearTimeout ( state.keyIgnore )
                            state.keyIgnore = setTimeout ( () => state.keyIgnore=null, listenOptions.keyWait )
                            r.pop ()
                            return 
                    }
                if ( sequence && r.length === state.maxSequence ) {      
                            keySequenceEnd ()
                            state.keyIgnore = setTimeout ( () => state.keyIgnore=null, listenOptions.keyWait )
                            return
                    }
                if ( sequence   )   keyTimer = setTimeout ( keySequenceEnd, listenOptions.keyWait )
                else                keySequenceEnd ()
        } // listenForSpecialKeys func.

    

    function listenForRegularKeys ( event ) {  // Listen for regular keyboard keys
                if ( _specialChars().hasOwnProperty ( event.code ))   return            
                clearTimeout ( keyTimer )
                if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                if ( state.keyIgnore ) {
                            clearTimeout ( state.keyIgnore )
                            state.keyIgnore = setTimeout ( () => state.keyIgnore=null, listenOptions.keyWait )
                            return 
                    }
                r.push ( _readKeyEvent ( event, _specialChars ))
                if ( sequence && r.length === state.maxSequence ) {
                            keySequenceEnd ()
                            state.keyIgnore = setTimeout ( () => state.keyIgnore=null, listenOptions.keyWait )
                            return
                    }
                if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, listenOptions.keyWait )
                else              keySequenceEnd ()
        } // listenForRegularKeys func.



    function start () {
                        if ( state.active ) return
                        document.addEventListener ( 'keydown' , listenForSpecialKeys )
                        document.addEventListener ( 'keypress', listenForRegularKeys )
                        state.active = true
        } 


    function stop () {
                        if ( !state.active ) return
                        document.removeEventListener ( 'keydown' , listenForSpecialKeys )
                        document.removeEventListener ( 'keypress', listenForRegularKeys )
                        state.active = false
                        // Clear any pending timers to prevent state pollution between tests
                        if ( keyTimer ) {
                                clearTimeout ( keyTimer )
                                keyTimer = null
                        }
                        if ( state.keyIgnore ) {
                                clearTimeout ( state.keyIgnore )
                                state.keyIgnore = null
                        }
                        // Reset all state variables to prevent interference between tests
                        r = []
                        sequence = true
                        ignore = false
        }
    
    return { start, stop }

} // _listenDOM func.



export default _listenDOM


