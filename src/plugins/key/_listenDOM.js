'use strict'



function _listenDOM ( dependencies, state ) {
// Listen for input signals and generate event titles  
    const { 
                ev
                , _specialChars
                , _readKeyEvent
                , mainDependencies
            } = dependencies
        , {
                  currentContext
                , streamKeys
                , listenOptions
            } = state
        , {
                  keyWait
            } = listenOptions
        ;
    
    let 
          r = []
        , keyTimer = null    // Timer for key sequence or null
        , sequence = true
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
                                    , dependencies : mainDependencies.extra
                                    , type : 'key'
                            };
                    if ( !sequence ) {
                            let signal = res.at(-1);
                            ev.emit ( signal, data )    
                            if ( ignore ) {
                                        res = res.slice ( 0, -1 )
                                        ignore = false
                                }
                        }
                            
                    if ( sequence ) {
                            const signal = `KEY:${res.join(',')}`
                            ev.emit ( signal, data )   
                            // Reset:
                            r = []
                            keyTimer = null
                        }
        } // keySequeceEnd func.


    
    function listenForSpecialKeys ( event ) { // Listen for special keyboard keys
                clearTimeout ( keyTimer )
                if ( _specialChars.hasOwnProperty(event.code) )   r.push ( _readKeyEvent ( event, _specialChars ))
                else                                             return
                if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                if ( listenOptions.keyIgnore ) {
                            clearTimeout ( listenOptions.keyIgnore )
                            listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                            return 
                    }
                if ( sequence && r.length === listenOptions.maxSequence ) {      
                            keySequenceEnd ()
                            listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                            return
                    }
                if ( sequence   )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
                else                keySequenceEnd ()
        } // listenForSpecialKeys func.

    

    function listenForRegularKeys ( event ) {  // Listen for regular keyboard keys
                if ( _specialChars.hasOwnProperty(event.code) )   return            
                clearTimeout ( keyTimer )
                if ( streamKeys )   streamKeys ({ key:event.key, context:currentContext.name, note:currentContext.note, dependencies:dependencies.extra })
                if ( listenOptions.keyIgnore ) {
                            clearTimeout ( listenOptions.keyIgnore )
                            listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                            return 
                    }
                r.push ( _readKeyEvent ( event, _specialChars ))
                if ( sequence && r.length === listenOptions.maxSequence ) {
                            keySequenceEnd ()
                            listenOptions.keyIgnore = setTimeout ( () => listenOptions.keyIgnore=null, keyWait )
                            return
                    }
                if ( sequence )   keyTimer = setTimeout ( keySequenceEnd, keyWait )
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
        }
    
    return { start, stop }

} // _listenDOM func.



export default _listenDOM


