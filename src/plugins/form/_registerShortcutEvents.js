'use strict'

function _registerShortcutEvents ( dependencies, pluginState ) {
const 
          { regex, _defaults, ev } = dependencies
        , { 
                  currentContext : { name: contextName, note }
                , shortcuts 
                , callbacks
                , ERROR_EVENT_NAME
           } = pluginState
        ;
        let watch=[], define=[], action=[], count = 0;
        if ( contextName == null )   return false
        Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        let isFormEv = regex.test ( shortcutName );
                        if ( !isFormEv ) return                
                        if ( shortcutName === 'FORM:WATCH' )    watch = list
                        if ( shortcutName === 'FORM:DEFINE' )   define = list
                        if ( shortcutName === 'FORM:ACTION' )   action = list
                        if ( shortcutName === 'FORM:SETUP' )    {
                                        // TODO: Setup fn not ready...
                                }
                })
        
        if ( action.length === 0 )   return count
   
        let setTypes = new Set ();
        if ( define.length === 0 )  define = [ _defaults.define ]
        if ( watch.length === 0  )  watch  = [ _defaults.watch ] 
        let watchList = watch.map ( el => el ({ 
                                                  dependencies : dependencies.extra 
                                                , context : contextName 
                                                , note
                                        })   )
                                        .reduce ( ( res, el) => {
                                                res.push ( el ) 
                                                return res
                                        }, [])
        pluginState.watchList = document.querySelectorAll ( watchList )
        pluginState.watchList.forEach ( el => {
                                        let 
                                                  { left, top, width, height } = el.getBoundingClientRect ()
                                                , scrollX = window.scrollX
                                                , scrollY = window.scrollY
                                                ;
                                        return setTypes.add ( define[0]({
                                                                  target : el
                                                                , context : contextName
                                                                , note
                                                                , dependencies : dependencies.extra
                                                                , viewport : {
                                                                                X: scrollX
                                                                              , Y: scrollY
                                                                              , width: window.innerWidth
                                                                              , height: window.innerHeight
                                                                        }
                                                                , sizes : { width , height }
                                                                , position : { x:left, y:top }
                                                                , pagePosition : { x:left+scrollX, y:top+scrollY }
                                                                }) 
                                                ) // setTypes
                        }) // forEach watchList 

        pluginState.typeFn = define[0] ? define[0] : _defaults.define
     
        action.forEach ( act => {
                        if ( !(act instanceof Function)) {  
                                ev.emit ( ERROR_EVENT_NAME, `The 'form:action' should be a function.` )
                                return false
                           }
                        
                        let list = act ({ dependencies : dependencies.extra })
                        
                        if ( !(list instanceof Array) ) {
                                ev.emit ( ERROR_EVENT_NAME, `Warning: The 'form:action' function should RETURN an array.` )
                                return false
                           }
                        list.forEach ( ({fn, type, timing, wait=0 }) => {
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
        count = Object.keys ( pluginState.callbacks ).length
        return count
} // _registerShortcutEvents func.



export default _registerShortcutEvents


