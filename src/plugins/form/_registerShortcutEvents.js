'use strict'

/**
 * @function _registerShortcutEvents
 * @description Register form shortcut events and handle setup
 * @param {Object} dependencies - Dependencies object containing regex, _defaults, ev
 * @param {Object} pluginState - Plugin state containing currentContext, shortcuts, callbacks, etc.
 * @returns {number|false} - Number of registered shortcuts or false if no actions
 * 
 * @typedef {Object} FormWatchData
 * @property {Object} dependencies - Extra dependencies object
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * 
 * @typedef {Object} FormDefineData
 * @property {Element} target - The DOM element being watched
 * @property {string} context - Current context name
 * @property {string|null} note - Current context note
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} viewport - Viewport information with X, Y, width, height
 * @property {Object} sizes - Element dimensions with width, height
 * @property {Object} position - Element position relative to viewport with x, y
 * @property {Object} pagePosition - Element position relative to page with x, y
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 * 
 * @typedef {Object} FormActionData
 * @property {Object} dependencies - Extra dependencies object
 * @property {Object} options - Plugin state listenOptions (reference to pluginState.listenOptions)
 */
function _registerShortcutEvents ( dependencies, pluginState ) {
const 
          { regex, _defaults, ev } = dependencies
        , { 
                  currentContext : { name: contextName, note }
                , shortcuts 
                , callbacks
                , ERROR_EVENT_NAME
                , defaultOptions 
           } = pluginState
        ;
        let watch=[], define=[], action=[], count = 0;
        if ( contextName == null )   return false
        Object.entries ( shortcuts[contextName] ).forEach ( ([shortcutName, list ]) => {   
                        let isFormEv = regex.test ( shortcutName );
                        if ( !isFormEv ) return
                        if ( shortcutName.includes('SETUP' )) {
                                        let updateOptions = list.reduce ( ( res, fn ) => {
                                                        let r = fn ({ 
                                                                        dependencies : dependencies.extra, 
                                                                        defaults     : structuredClone ( pluginState.defaultOptions ),
                                                                        options      : pluginState.listenOptions
                                                                })
                                                        return Object.assign ( res, r )
                                                }, defaultOptions )
                                        Object.assign ( pluginState.listenOptions, updateOptions )
                                        return
                                } 
                        if ( shortcutName === 'FORM:WATCH' )    watch = list
                        if ( shortcutName === 'FORM:DEFINE' )   define = list
                        if ( shortcutName === 'FORM:ACTION' )   action = list
                        
                })
        
        if ( action.length === 0 )   return count
   
        let setTypes = new Set ();
        if ( define.length === 0 )  define = [ _defaults.define ]
        if ( watch.length === 0  )  watch  = [ _defaults.watch ] 
        let watchList = watch.map ( el => el ({ 
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
                        
                        let list = act ({ 
                                 dependencies : dependencies.extra,
                                 options      : pluginState.listenOptions
                         })
                        
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


