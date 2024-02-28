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

// Plugins
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
                    , plugins        : [] // Array of active plugins
                    , exposeShortcut : (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false   // Keyboard shortcut log function
              } // state
        , dependencies = { 
                              ev
                            , inAPI
                            , API
                            , extra : {}
                        }
        ;

    

    // System events listeners. Events that control plugin's lifecycle.:
    ev.on ( '@context-change', context  => state.plugins.map ( plugin => plugin.contextChange(context))   )
    
    // ----------------------  > PLUGIN METHODS < ---------------------- //
    /**
     * @function enable
     * @description Enable a plugin
     * @returns {void}
     */
    API.enable = ( plugin,options={}) => {
                const 
                      name = plugin.name
                    , ix = inAPI._systemAction ( name, 'none' )
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
                const ix = inAPI._systemAction ( pluginName, 'destroy' );
                if ( ix !== -1 )   state.plugins = state.plugins.filter ( (plugin, i) => i !== ix )
      } // disable func.


    /**
     * @function mute
     * @description Mute a plugin
     * @returns number - Index of the plugin in the plugins array ( -1 if not found ).
     */
    API.mute = pluginName => inAPI._systemAction ( pluginName, 'mute'   )

    /**
     * @function unmute
     * @description Unmute a plugin
     * @returns number - Index of the plugin in the plugins array ( -1 if not found ).
     */
    API.unmute = pluginName => inAPI._systemAction ( pluginName, 'unmute' )


    

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
                        let pausedEvent = inAPI._readWithPlugins ( name );
                        ev.stop ( pausedEvent )
                  }

    /**
       * @function resume
       * @description Resume shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be resumed. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
    API.resume = (name='*') => {
                        const resumedEvent = inAPI._readWithPlugins ( name )
                        ev.start ( resumedEvent )
                  }

    /**
     * @function emit
     * @description Emit event for shortcut in current context
     * @param {string} name - Shortcut name
     * @param {any} [args] - Arguments for callback function
     * @returns {void}
     **/
    API.emit = (name,...args) => ev.emit ( inAPI._readWithPlugins(name), dependencies.extra, ...args )

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
    API.setDependencies = deps => dependencies.extra = { ...dependencies.extra, ...deps }

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

    return API
} // main func.



export { main as shortcuts }
export { 
            pluginKey
          , pluginClick
        }


