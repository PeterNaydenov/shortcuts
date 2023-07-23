'use strict'

/**
 *  Shortcuts
 *  ========
 *  Create shortcuts for your web application based on keyboard and mouse events.
 * 
 *  History notes:
 *  - Development was started on June 21st, 2023
 */

import notice from '@peter.naydenov/notice'

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
    /**
     *  Need options for:
     *  - Shortcut sequence or not;
     *  - Waiting time during shortcut input ( if shortcut sequence is defined );
     *  - Click placeholder name. Default is 'click'( attribute 'data-click' );
     *  - Listening for mouse events or not;
     *  - Listening for skeyboard events or not;
     *  - A log function;
     */
    const
          ev = notice ()
        , currentContext = { name: null, note: null }
        , exposeShortcut = (options.onShortcut && ( typeof options.onShortcut === 'function')) ? options.onShortcut : false
        , dependencies = { 
                              specialChars 
                            , readKeyEvent
                            , readMouseEvent
                            , findTarget
                            , ev
                            , exposeShortcut
                        }
        , listenOptions = {
                              mouseWait     : options.mouseWait ? options.mouseWait : 320   // 320 ms
                            , maxClicks     : options.maxClicks ? options.maxClicks : 5    // The maximum number of clicks in a sequence
                            , mouseSequence : options.mouseSequence ? options.mouseSequence : true //
                            , keyWait       : options.keyWait ? options.keyWait : 480   // 480 ms
                            , maxSequence   : options.maxSequence ? options.maxSequence : 30  // How many keys can be pressed in a sequence
                            , clickTarget   : options.clickTarget ? options.clickTarget :  'click' // Data-attribute name for click target ( data-click )
                            , listenFor     : (options.listenFor && Array.isArray(options.listenFor)) ? options.listenFor : [ 'mouse', 'keyboard' ] // What to listen for: mouse, keyboard, both
                       }
        , shortcuts = {}   // shortcuts = { contextName : { shortcut :  callback[] } }
        , getContext = () => currentContext.name
        , getNote    = () => currentContext.note
        , setNote    = (note=null) => { if (typeof note === 'string' || note == null )   currentContext.note = note }
        ;
    
    listen ( dependencies, listenOptions, currentContext )

    return {  // shortcuts API
        load          : load ( shortcuts, readShortcut, changeContext( shortcuts, ev, currentContext ), getContext )      
      , unload        : unload ( shortcuts, ev, currentContext )
      , changeContext : changeContext ( shortcuts, ev, currentContext )
      , pause         : () => ev.stop ()
      , resume        : () => ev.start ()
      , listContexts  : () => Object.keys ( shortcuts )
      , getContext
      , getNote 
      , setNote
    }
} // main func.



main.getDefaults = () => ({
                          mouseWait     : 320     // 320 ms
                        , maxClicks     : 5       // The maximum number of clicks in a sequence
                        , mouseSequence : true    //
                        , keyWait       : 480     // 480 ms
                        , maxSequence   : 30      // How many keys can be pressed in a sequence
                        , clickTarget   : 'click' // Data-attribute name for click target ( data-click )
                        , listenFor     : [ 'mouse', 'keyboard' ]
                    })



export default main


