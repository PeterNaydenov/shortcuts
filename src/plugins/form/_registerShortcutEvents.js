'use strict'

/**
 * @function _registerShortcutEvents
 * @description Register form shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex, _defaults, ev
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts, callbacks, etc.
 * @returns {number|false} - Number of registered shortcuts or false if no actions
 */
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
        // Options are per context. Start from the plugin defaults
        Object.keys ( pluginState.listenOptions ).forEach ( k => delete pluginState.listenOptions[k] )
        Object.assign ( pluginState.listenOptions, structuredClone ( pluginState.defaultOptions ))
        if ( contextName == null )   return false
        Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        const isFormEv = regex.test ( shortcutName );
                        if ( !isFormEv ) return
                        if ( shortcutName.includes('SETUP' )) {
                                        const updateOptions = list.reduce ( ( res, fn ) => {
                                                        const r = fn ({ 
                                                                        dependencies : dependencies.extra, 
                                                                        defaults     : structuredClone ( pluginState.defaultOptions ),
                                                                        options      : pluginState.listenOptions
                                                                })
                                                        return Object.assign ( res, r )
                                                }, {} )
                                        Object.assign ( pluginState.listenOptions, updateOptions )
                                        return
                                } 
                        if ( shortcutName === 'FORM:WATCH' )    watch = list
                        if ( shortcutName === 'FORM:DEFINE' )   define = list
                        if ( shortcutName === 'FORM:ACTION' )   action = list
                        
                })
        
        if ( action.length === 0 )   return count
   
        const setTypes = new Set ();
        if ( define.length === 0 )  define = [ _defaults.define ]
        if ( watch.length === 0  )  watch  = [ _defaults.watch ] 
        const watchList = watch.map ( el => el ({ 
                                                  dependencies : dependencies.extra 
                                                , context : contextName 
                                                , note
                                                , options : pluginState.listenOptions
                                        })   )
                                        .reduce ( ( res, el) => {
                                                res.push ( el ) 
                                                return res
                                        }, [])
        pluginState.watchList = document.querySelectorAll ( watchList )
        pluginState.watchList.forEach ( el => {
                                        const 
                                                  { left, top, width, height } = el.getBoundingClientRect ()
                                                , scrollX = window.scrollX
                                                , scrollY = window.scrollY
                                                ;
                                        return setTypes.add ( define[0]({
                                                                  target : el
                                                                , context : contextName
                                                                , note
                                                                , dependencies : dependencies.extra
                                                                , options : pluginState.listenOptions
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
                        
                        const list = act ({ 
                                 dependencies : dependencies.extra,
                                 options      : pluginState.listenOptions
                         })
                        
                        if ( !(list instanceof Array) ) {
                                ev.emit ( ERROR_EVENT_NAME, `Warning: The 'form:action' function should RETURN an array.` )
                                return false
                           }
                        list.forEach ( ({fn, type, timing, wait=0 }) => {
                                        if ( setTypes.has ( type) && fn instanceof Function ) {
                                                const key = `${type}/${timing}`
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


