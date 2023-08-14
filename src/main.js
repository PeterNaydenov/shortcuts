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
 */



import notice from '@peter.naydenov/notice'   // Docs: https://github.com/PeterNaydenov/notice

import listen         from './listen.js'
import readShortcut   from './readShortcut.js'
import readKeyEvent   from './readKeyEvent.js'
import readMouseEvent from './readMouseEvent.js'
import findTarget from './findTarget.js'
import specialChars from './specialChars.js'
import load from './load.js'
import unload from './unload.js'
import changeContext from './changeContext.js'





function main ( options = {} ) {
    const
          ev = notice ()  // Event emitter instance
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
                              specialChars 
                            , readKeyEvent
                            , readMouseEvent
                            , findTarget
                            , ev
                            , exposeShortcut
                            , streamKeys
                        }
        ;
    
    listen ( dependencies, listenOptions, currentContext )

    return {  // shortcuts API
        load          : load ( shortcuts, readShortcut, changeContext( shortcuts, listenOptions, ev, currentContext ), getContext )      
      , unload        : unload ( shortcuts, ev, currentContext )
      , changeContext : changeContext ( shortcuts, listenOptions, ev, currentContext )
      , pause         : () => ev.stop ()
      , resume        : () => ev.start ()
      , listContexts  : () => Object.keys ( shortcuts )
      , getContext
      , getNote 
      , setNote
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


