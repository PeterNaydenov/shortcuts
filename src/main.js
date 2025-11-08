'use strict'

/**
 * @typedef {Object} dependencies
 * @property {Object} ev - Event emitter instance
 * @property {Object} inAPI - Internal API object
 * @property {Object} API - Public API object
 * @property {Object} extra - Extra dependencies object
 */

/**
 * @typedef {Object} state
 * @property {Object} currentContext - Current context data container with name and note properties
 * @property {Object} shortcuts - Shortcuts object: { contextName : { shortcut : callback[] } }
 * @property {Array} plugins - Array of active plugins
 * @property {Function|null} exposeShortcut - Keyboard shortcut log function
 * @property {string} ERROR_EVENT_NAME - Name for error events
 */

/**
 * @typedef {Object} PluginAPI
 * @property {function(): string} getPrefix - Get plugin prefix
 * @property {function(string): string} shortcutName - Format shortcut name
 * @property {function(string): void} contextChange - Handle context change
 * @property {function(): void} mute - Mute the plugin
 * @property {function(): void} unmute - Unmute the plugin
 * @property {function(): void} destroy - Destroy the plugin
 */

/**
 * @typedef {Object} contextShortcuts
 * @property {string} context - Context name
 * @property {string[]} shortcuts - List of shortcuts in a context
 */

/**
 * @typedef {Object} ShortcutsAPI
 * @property {function(Function, Object): void} enablePlugin - Enable a plugin
 * @property {function(string): void} disablePlugin - Disable a plugin
 * @property {function(string): number} mutePlugin - Mute a plugin
 * @property {function(string): number} unmutePlugin - Unmute a plugin
 * @property {function(): string[]} listPlugins - List enabled plugins
 * @property {function(): string|null} getContext - Get current context name
 * @property {function(): string|null} getNote - Get current context note
 * @property {function(string|null): void} setNote - Set current context note
 * @property {function(string): void} pause - Pause shortcuts in current context
 * @property {function(string): void} resume - Resume shortcuts in current context
 * @property {function(string, ...any): void} emit - Emit event for shortcut
 * @property {function(): string[]} listContexts - List all context names
 * @property {function(Object): void} setDependencies - Set external dependencies
 * @property {function(): Object} getDependencies - Get external dependencies
 * @property {function(): void} reset - Reset the library instance
 * @property {function(string|boolean): void} changeContext - Change current context
 * @property {function(string|null): string[]|contextShortcuts[]|null} listShortcuts - List shortcuts
 * @property {function(Object): void} load - Load shortcuts into contexts
 * @property {function(string): void} unload - Unload a context
 */

/**
 * Shortcuts
 * =========
 *
 * Create shortcuts for your web application based on keyboard and mouse and DOM events.
 * Repository: https://github.com/PeterNaydenov/shortcuts
 *
 * History notes:
 * - Development was started on June 21st, 2023
 * - First version was published on August 14th, 2023
 * - Method 'emit' was added on September 30st, 2023
 * - Version 2.0.0 was published on October 16th, 2023
 * - Version 3.0.0. Plugin system. Published on March 5th, 2024
 * - Version 3.2.0. Added plugin 'form'. Published on August 15th, 2025
 */



import notice  from '@peter.naydenov/notice'   // Docs: https://github.com/PeterNaydenov/notice
import methods from './methods/index.js'

// Plugins
import pluginKey    from './plugins/key/index.js'
import pluginClick  from './plugins/click/index.js'
import pluginForm   from './plugins/form/index.js'
import pluginHover  from './plugins/hover/index.js'
import pluginScroll from './plugins/scroll/index.js'





/**
 * @function shortcuts
 * @description Create a shortcuts instance
 * @param {Object} [options={}] - Configuration options
 * @param {function} [options.onShortcut] - Function to log shortcut events
 * @param {string} [options.errorEventName='@shortcuts-error'] - Name for error events
 * @returns {ShortcutsAPI} The shortcuts API
 */
function main ( options = {} ) {
    const  
          inAPI = {}      // API for internal methods
        , API   = {}      // API for public methods
        ,  ev = notice ()  // Event emitter instance
        , state = {
                      currentContext   : { name: null, note: null } // Context data container
                    , shortcuts        : {}   // shortcuts = { contextName : { shortcut :  callback[] } }
                    , plugins          : [] // Array of active plugins
                    , exposeShortcut   : (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false   // Keyboard shortcut log function
                    , ERROR_EVENT_NAME : ( options.errorEventName ) ? options.errorEventName : '@shortcuts-error'
              } // state
        ;
    const dependencies = { 
                              ev
                            , inAPI
                            , API
                            , extra : {}
                        };

    // ----------------------  > PLUGIN METHODS < ---------------------- //
    /**
     * @function enablePlugin
     * @description Enable a plugin
     * @param {Function} plugin - Plugin function to enable
     * @param {Object} [options={}] - Plugin configuration options
     * @returns {void}
     */
    API.enablePlugin = ( plugin, options={}) => {
                if ( typeof plugin !== 'function' ) return
                const setupPlugin = inAPI._setupPlugin
                const plugApp = plugin ( setupPlugin, options )
                const 
                      name = plugApp.getPrefix ()
                    , ix = inAPI._systemAction ( name, 'none' )
                    ;
                if ( ix === -1 ) {   // If plugin is not registered
                            // Started instance of the plugin
                            state.plugins.push ( plugApp )
                            plugApp.unmute ()
                    }
                else {
                            plugApp.destroy ()
                            state.plugins[ix].unmute ()
                    }
      } // enable func.



    /**
     * @function disablePlugin
     * @description Disable a plugin
     * @param {string} pluginName - Name of the plugin to disable
     * @returns {void}
     */
    API.disablePlugin = pluginName => { 
                const ix = inAPI._systemAction ( pluginName, 'destroy' );
                if ( ix !== -1 )   state.plugins.splice ( ix, 1 )
      } // disable func.


    /**
     * @function mutePlugin
     * @description Mute a plugin
     * @param {string} pluginName - Name of the plugin to mute
     * @returns {number} - Index of the plugin in the plugins array ( -1 if not found )
     */
    API.mutePlugin = pluginName => inAPI._systemAction ( pluginName, 'mute'   )

    /**
     * @function unmutePlugin
     * @description Unmute a plugin
     * @param {string} pluginName - Name of the plugin to unmute
     * @returns {number} - Index of the plugin in the plugins array ( -1 if not found )
     */
    API.unmutePlugin = pluginName => inAPI._systemAction ( pluginName, 'unmute' )


    /**
     * @function listPlugins
     * @description List all enabled plugins
     * @returns {string[]} - Array of plugin names
     */
    API.listPlugins = () => state.plugins.map ( plugin => plugin.getPrefix() )


    
    // ----------------------  > PUBLIC METHODS < ---------------------- //
    /**
     * @function getContext
     * @description Get current context name
     * @returns {string|null} - Current context name
     */
    API.getContext = () => state.currentContext.name

    /**
     * @function getNote
     * @description Get current context note
     * @returns {string|null} - Current context note
     */
    API.getNote    = () => state.currentContext.note

    /**
     * @function setNote
     * @description Set current context note
     * @param {string|null} note - Context note
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
                        const pausedEvent = inAPI._readShortcutWithPlugins ( name );
                        ev.stop ( pausedEvent )
                  }

    /**
       * @function resume
       * @description Resume shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be resumed. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
    API.resume = (name='*') => {
                        const resumedEvent = inAPI._readShortcutWithPlugins ( name )
                        ev.start ( resumedEvent )
                  }

    /**
     * @function emit
     * @description Emit event for shortcut in current context
     * @param {string} name - Shortcut name
     * @param {any} [args] - Arguments for callback function
     * @returns {void}
     **/
    API.emit = (name,...args) =>  ev.emit ( inAPI._readShortcutWithPlugins ( name ), ...args )
      

    /**
     * @function listContexts
     * @description List all context names
     * @returns {string[]} - Array of context names
     */
    API.listContexts = () => Object.keys ( state.shortcuts )



    /**
     * @function setDependencies
     * @description Set a dependency package that will be provided to each action function
     * @param {Object} deps - Enumerate external dependencies
     * @returns {void}
     */
    API.setDependencies = deps => Object.assign ( dependencies.extra, deps ) 

    /**
     * @function getDependencies
     * @description Get a dependency package that will be provided to each action function
     * @returns {Object} - Enumerate external dependencies
     **/
    API.getDependencies = () => dependencies.extra


    /**
     * @function reset
     * @description Reset the library instance
     * @returns {void}
     */
    API.reset = function reset () {
                        ev.reset ()
                        API.changeContext ()
                        state.plugins.forEach ( plugin => plugin.destroy () )
                        API.listContexts ().map ( cx =>  API.unload ( cx ))
                        dependencies.extra = {}
                        state.exposeShortcut = null
      } // reset func.



    Object.entries ( methods ).forEach ( ([ name, method ]) => {
                if ( name.startsWith('_') ) inAPI [ name ] = method ( dependencies, state )
                else                          API [ name ] = method ( dependencies, state )
        })

    return API
} // main func.



/** @type {function} */
export { main as shortcuts }
export { 
            pluginKey
          , pluginClick
          , pluginForm
          , pluginHover
          , pluginScroll
        }


