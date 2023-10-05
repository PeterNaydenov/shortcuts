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



import notice from '@peter.naydenov/notice'   // Docs: https://github.com/PeterNaydenov/notice

import _readKeyEvent   from './_readKeyEvent.js'
import _readShortcut   from './_readShortcut.js'
import _readMouseEvent from './_readMouseEvent.js'
import _findTarget      from './_findTarget.js'

import listen         from './listen.js'
import _specialChars from './_specialChars.js'
import load from './load.js'
import unload from './unload.js'
import changeContext from './changeContext.js'
import listShortcuts from './listShortcuts.js'





function main ( options = {} ) {
    const
          ev = notice ()  // Event emitter instance
        , state = {

              } // state
        , currentContext = { name: null, note: null } // Context data container
        , exposeShortcut = (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false
        , streamKeys     = (options.streamKeys && ( typeof options.streamKeys === 'function')) ? options.streamKeys : false
        , listenOptions = {
                              mouseWait     : options.mouseWait ? options.mouseWait : 320   // 320 ms
                            , maxClicks     : 1  // The maximum number of clicks in a sequence. Controlled automatically by 'changeContext' function.
                            , keyWait       : options.keyWait ? options.keyWait : 480   // 480 ms
                            , maxSequence   : 1  // How many keys can be pressed in a sequence. Controlled automatically by 'changeContext' function.
                            , clickTarget   : options.clickTarget ? options.clickTarget :  'click' // Data-attribute name for click target ( data-click )
                            , listenFor     : (options.listenFor && Array.isArray(options.listenFor)) ? options.listenFor : [ 'mouse', 'keyboard' ] // What to listen for: ['mouse'], ['keyboard'], ['mouse', 'keyboard']
                            , keyIgnore     : null   // Timer for ignoring key presses after max sequence or null. Not a public option.
                       }
        , shortcuts = {}   // shortcuts = { contextName : { shortcut :  callback[] } }
        , getContext = () => currentContext.name
        , getNote    = () => currentContext.note
        , setNote    = (note=null) => { if (typeof note === 'string' || note == null )   currentContext.note = note }
        , dependencies = { 
                              _specialChars 
                            , _readKeyEvent
                            , _readMouseEvent
                            , _findTarget
                            , ev
                            , exposeShortcut
                            , streamKeys
                            , extra : {}
                        }
        ;
  
    listen ( dependencies, listenOptions, currentContext )

    return {  // shortcuts API
        load          : load ( shortcuts, _readShortcut, changeContext( shortcuts, listenOptions, ev, currentContext ), getContext )      
      , unload        : unload ( shortcuts, ev, currentContext )
      , changeContext : changeContext ( shortcuts, listenOptions, ev, currentContext )
      /**
       * @function pause
       * @description Pause shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be paused. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
      , pause         : (name='*') => ev.stop ( _readShortcut(name) )
      /**
       * @function resume
       * @description Resume shortcut(s) in current context
       * @param {string} [name='*' ] - Shortcut name that should be resumed. Default is '*' - all shortcuts in current context.
       * @returns {void}
       */
      , resume        : (name='*') => ev.start ( _readShortcut(name) )
      , emit          : (x,...args) => ev.emit ( _readShortcut(x), dependencies.extra, ...args )
      , listContexts  : () => Object.keys ( shortcuts )
      , listShortcuts : listShortcuts ( shortcuts )
      , getContext
      , getNote 
      , setNote
      , setDependencies : (deps) => dependencies.extra = { ...dependencies.extra, ...deps }
    }
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


