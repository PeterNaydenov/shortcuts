'use strict'

import _listenDOM from "./_listenDOM"
import _normalizeShortcutName from "./_normalizeShortcutName"
import _registerShortcutEvents from "./_registerShortcutEvents"



function pluginScroll ( dependencies, state, options ) {
    // up, down, left, right
        let 
                  { currentContext, shortcuts } = state
                , { inAPI } = dependencies
                , deps = {
                              ev: dependencies.ev
                            , mainDependencies : dependencies
                            , regex : /SCROLL\s*\:/i
                        }
                , pluginState = {
                                  currentContext        // Reference to current context (from global state)
                                , active : false        // Is plugin active?
                                , lastPosition  : null  // Last scroll position
                                , lastDirection : null  // Last scroll direction
                                , shortcuts             // Reference to shortcuts (from global state)
                                , listenOptions  : {
                                                  scrollWait    : 50  // 50 ms. Delay between scroll events 
                                                , endScrollWait : 400 // 400 ms. When scroll was stopped.
                                                , minSpace      : 40  // 40 px. Minimum distance between scroll events
                                        }
                            } // pluginState
                ;
        
        function resetState () {
                        pluginState.active = false
            } // resetState func.
        deps.resetState = resetState

        return inAPI._setupPlugin ( {
                                  prefix : 'scroll'
                                , _normalizeShortcutName
                                , _registerShortcutEvents
                                , _listenDOM
                                , pluginState
                                , deps
                        })
} // pluginScroll func.



export default pluginScroll


