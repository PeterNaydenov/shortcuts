'use strict'

/**
 *  Shortcuts
 *  ========
 * 
 *  Create shortcuts for your web application based on keyboard and mouse events.
 *  Repository: https://github.com/PeterNaydenov/shortcuts
 * 
 *  History notes:
 *  - Development was started on June 21st, 2023
 *  - First version was published on August 14th, 2023
 *  - Method 'emit' was added on September 30st, 2023
 *  - Version 2.0.0 was published on October 16th, 2023
 *  - Version 3.0.0. Plugin system. Published on ...
 */



import notice  from '@peter.naydenov/notice'   // Docs: https://github.com/PeterNaydenov/notice
import methods from './methods/index.js'

import pluginKey from './plugins/key/index.js'
import pluginClick from './plugins/click/index.js'





function main ( options = {} ) {
    const
          ev = notice ()  // Event emitter instance
        , inAPI = {}      // API for internal methods
        , API   = {}      // API for public methods
        , state = {
                      currentContext : { name: null, note: null } // Context data container
                    , shortcuts      : {}   // shortcuts = { contextName : { shortcut :  callback[] } }
                    , listenOptions  : {
                                          mouseWait     : options.mouseWait ? options.mouseWait : 320   // 320 ms
                                        , maxClicks     : 1  // The maximum number of clicks in a sequence. Controlled automatically by 'changeContext' function.
                                        , keyWait       : options.keyWait ? options.keyWait : 480   // 480 ms
                                        , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                                        , clickTarget   : options.clickTarget ? options.clickTarget :  'click' // Data-attribute name for click target ( data-click )
                                        , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                                    }
                    , plugins        : [] // Array of active plugins
                    , exposeShortcut : (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false   // Keyboard shortcut log function
                    , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false   // Keyboard stream function
              } // state
        , dependencies = { 
                              ev
                            , inAPI
                            , API
                            , extra : {}
                        }
        ;





    // System events listeners. Events that control plugin's lifecycle.:    
    ev.on ( '@context-change', context  => {
                                  ev.reset ()
                                  state.plugins.map ( plugin => plugin.contextChange(context))
                          })


    
    function _systemAction ( pluginName, fn, params=null ) {   // Specific plugin command: Mute, unmute, pause, resume, destroy
                        return state.plugins.findIndex ( plugin => {
                                      if ( plugin.getPrefix() === pluginName ) {  
                                                  if ( plugin[fn] )   plugin[fn]( params )
                                                  return true
                                          }
                                      return false
                                  })
                } // systemAction func.



    // ----------------------  > PLUGIN METHODS < ---------------------- //
    /**
     * @function enable
     * @description Enable a plugin
     * @returns {void}
     */
    API.enable = ( plugin,options={}) => {
                const 
                      name = plugin.name
                    , ix = _systemAction ( name, 'none' )
                    ;

                if ( ix === -1 ) {   // If plugin is not registered
                            let plugApp;   // Started instance of the plugin
                            plugApp = plugin ( dependencies, state, options )
                            state.plugins.push ( plugApp )
                    }
      } // enable func.



    /**
     * @function disable
     * @description Disable a plugin
     * @returns {void}
     */
    API.disable = pluginName => { 
                const ix = _systemAction ( pluginName, 'destroy' );
                if ( ix !== -1 )   state.plugins = state.plugins.filter ( (plugin, i) => i !== ix )
      } // disable func.


    /**
     * @function mute
     * @description Mute a plugin
     * @returns number - Index of the plugin in the plugins array ( -1 if not found ).
     */
    API.mute = pluginName => _systemAction ( pluginName, 'mute'   )

    /**
     * @function unmute
     * @description Unmute a plugin
     * @returns number - Index of the plugin in the plugins array ( -1 if not found ).
     */
    API.unmute = pluginName => _systemAction ( pluginName, 'unmute' )


    

    // ----------------------  > PUBLIC METHODS < ---------------------- //
    /**
     * @function getContext
     * @description Get current context name
     * @returns {string} - Current context name
     */
    API.getContext = () => state.currentContext.name

    /**
     * @function getNote
     * @description Get current context note
     * @returns {string} - Current context note
     */
    API.getNote    = () => state.currentContext.note

    /**
     * @function setNote
     * @description Set current context note
     * @param {string} note - Context note
     * @returns {void}
     */
    API.setNote    = (note=null) => { if (typeof note === 'string' || note == null )   state.currentContext.note = note }

    /**
       * @function pause
       * @description Pause shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be paused. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
    API.pause = (name='*') => {
                        const pausedEvent = inAPI._readShortcut(name)
                        ev.stop ( pausedEvent )
                  }

    /**
       * @function resume
       * @description Resume shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be resumed. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
    API.resume = (name='*') => {
                        const resumedEvent = inAPI._readShortcut(name)
                        ev.start ( resumedEvent )
                  }

    /**
     * @function emit
     * @description Emit event for shortcut in current context
     * @param {string} name - Shortcut name
     * @param {any} [args] - Arguments for callback function
     * @returns {void}
     **/
    API.emit = (name,...args) => ev.emit ( inAPI._readShortcut(name), dependencies.extra, ...args )

    /**
     * @function listContexts
     * @description List all context names
     * @returns {string[]} - Array of context names
     */
    API.listContexts = () => Object.keys ( state.shortcuts )



    /**
     * @function setDependencies
     * @description Set a dependency package that will be provided to each action function
     * @param {object} deps - Enumerate external dependencies
     * @returns {void}
     */
    API.setDependencies = (deps) => dependencies.extra = { ...dependencies.extra, ...deps }

    /**
     * @function getDependencies
     * @description Get a dependency package that will be provided to each action function
     * @returns {object} - Enumerate external dependencies
     **/
    API.getDependencies = () => dependencies.extra



    Object.entries ( methods ).forEach ( ([ name, method ]) => {
                if ( name.startsWith('_') ) inAPI [ name ] = method ( dependencies, state )
                else                          API [ name ] = method ( dependencies, state )
        })
  
    // Old way to run a library:
    // inAPI._listen ()
    // After the implementation of the plugin system, the library is started by enabling the plugins:
    // TODO: ...

    return API
} // main func.



main.getDefaults = () => ({
                          mouseWait     : 320     // 320 ms
                        , keyWait       : 480     // 480 ms
                        , clickTarget   : 'click' // Data-attribute name for click target ( data-click )
                        , onShortcut    : false   // Shortcut log function or false 
                        , streamKeys    : false   // Stream keys function or false
                    })



// export default main
export { main as shortcuts }
export { 
            pluginKey
          , pluginClick
        }


