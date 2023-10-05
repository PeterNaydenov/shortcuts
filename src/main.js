'use strict'

/**
 *  Shortcuts
 *  ========
 *  Create shortcuts for your web application based on keyboard and mouse events.
 *  Repository: https://github.com/PeterNaydenov/shortcuts
 * 
 *  History notes:
 *  - Development was started on June 21st, 2023
 *  - First version was published on August 14th, 2023
 *  - Method 'emit' was added on September 30st, 2023
 */



import notice  from '@peter.naydenov/notice'   // Docs: https://github.com/PeterNaydenov/notice
import methods from './methods/index.js'





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
                                        , listenFor     : (options.listenFor && Array.isArray(options.listenFor)) ? options.listenFor : [ 'mouse', 'keyboard' ] // What to listen for: ['mouse'], ['keyboard'], ['mouse', 'keyboard']
                                        , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                                    }
                    , exposeShortcut : (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false
                    , streamKeys     : (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false
              } // state
        , dependencies = { 
                              ev
                            , inAPI
                            , API
                            , extra : {}
                        }
        ;

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
    API.pause = (name='*') => ev.stop ( inAPI._readShortcut(name) )

    /**
       * @function resume
       * @description Resume shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be resumed. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
    API.resume = (name='*') => ev.start ( inAPI._readShortcut(name) )

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
    API.listContexts = () => Object.keys ( shortcuts )

    /**
     * @function setDependencies
     * @description Set a dependency package that will be provided to each action function
     * @param {object} deps - Enumerate external dependencies
     * @returns {void}
     */
    API.setDependencies = (deps) => dependencies.extra = { ...dependencies.extra, ...deps }



    Object.entries ( methods ).forEach ( ([ name, method ]) => {
                if ( name.startsWith('_') ) inAPI [ name ] = method ( dependencies, state )
                else                          API [ name ] = method ( dependencies, state )
        })
  
    inAPI._listen ()
    return API
} // main func.



main.getDefaults = () => ({
                          mouseWait     : 320     // 320 ms   // TODO: Slow down. It's too fast at the moment.
                        , keyWait       : 480     // 480 ms
                        , clickTarget   : 'click' // Data-attribute name for click target ( data-click )
                        , listenFor     : [ 'mouse', 'keyboard' ]
                        , onShortcut    : false   // Shortcut log function or false 
                        , streamKeys    : false   // Stream keys function or false
                    })



export default main


