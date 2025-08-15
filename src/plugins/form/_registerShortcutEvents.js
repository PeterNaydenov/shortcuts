'use strict'

function _registerShortcutEvents ( dependencies, pluginState ) {
const 
          { regex, _defaults, ev } = dependencies
        , { 
                  currentContext : { name: contextName }
                , shortcuts 
                , callbacks
           } = pluginState
        ;
        let watch=[], define=[], action=[];
        if ( contextName == null )   return false
        Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        let isFormEv = regex.test ( shortcutName );
                        if ( !isFormEv ) return                
                        if ( shortcutName === 'FORM:WATCH' )    watch = list
                        if ( shortcutName === 'FORM:DEFINE' )   define = list
                        if ( shortcutName === 'FORM:ACTION' )   action = list
                })
        
        if ( action.length === 0 )   return false
        
        let setTypes = new Set ();
        if ( define.length === 0 )  define = [ _defaults.define ]
        if ( watch.length === 0  )  watch  = [ _defaults.watch ] 
        let watchList = watch.map ( el => el() )
                                        .reduce ( ( res, el) => {
                                                res.push ( el ) 
                                                return res
                                        }, [])
        pluginState.watchList = document.querySelectorAll ( watchList )
        pluginState.watchList.forEach ( el => setTypes.add (define[0](el)) ) 

        pluginState.typeFn = define[0] ? define[0] : _defaults.define
        action.forEach ( act => {
                        
                        if ( !(act instanceof Function)) {  
                                console.warn ( `Warning: The 'form:action' should be a function.` )
                                return false
                           }
                        let list = act ()
                        if ( !(list instanceof Array) ) {
                                console.warn ( `Warning: The 'form:action' function should RETURN an array.` )
                                return false
                           }
                        act().forEach ( ({fn, type, timing, wait=0 }) => {
                                        if ( setTypes.has ( type) && fn instanceof Function ) {
                                                let key = `${type}/${timing}`
                                                const hasProperty = callbacks.hasOwnProperty ( key );
                                                hasProperty ? 
                                                                callbacks[key].push ( fn ) :
                                                                callbacks[key] = [ fn ]
                                                if ( !hasProperty ) {
                                                                ev.on ( key, ( props, callbacks ) => {   // Register the 'type/timing' as an event
                                                                                callbacks.forEach ( cb => { if ( cb instanceof Function )   cb ( props )   })
                                                                        }) 
                                                        }  
                                        } // if function
                                        if ( timing === 'instant' )   pluginState.wait[`${type}`] = wait
                                }) // for each act
                }) // for each action
        if ( Object.keys(pluginState.callbacks).length > 0 )   return true
        else                                                   return false
} // _registerShortcutEvents func.



export default _registerShortcutEvents


