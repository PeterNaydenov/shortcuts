import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor
} from '@testing-library/dom'



import '../test-helpers/style.css'
import Block            from '../test-helpers/Block.jsx'
import VisaulController from '@peter.naydenov/visual-controller-for-react'
import wait             from '../test-helpers/wait.js'
import { 
          shortcuts 
        , pluginKey
        , pluginClick
        , pluginForm
                } from '../src/main.js'



const html = new VisaulController ();
let
        a = false
      , b = false
      , c = null
      , d = null
      ;

const contextDefinition = {
                  general : {
                            ' key : shift+a': [ 
                                        () => a = true, 
                                        () => c = 'triggered' 
                                      ]
                        }
                , touch : {
                              // Single click with left button
                              ' click: left-1': ({ target }) => {
                                                b = true
                                                // Named argument 'target' should be available
                                                c = target.dataset.click
                                          },
                              // Double click with left button
                              'click: left-2': ({ target }) => {
                                                b = true
                                                c = target.dataset.click
                                          },
                               // Just for have definition for more then 2 clicks
                               'click: left-3': () => {},
                               // Single click with right button
                               'click: right-1': () => {
                                                c = 'right'
                                          },
                              ' click: right-2': () => d = 'clicked',
                               // Click with modifier
                                'click: left-1-alt': () => d = 'alt-clicked',
                                'click: left-1-ctrl': () => d = 'ctrl-clicked',
                                'click: left-1-shift': () => d = 'shift-clicked'
                        }
                , extra : {    
                            'key : p,r,o,b,a': () => b = true                        
                        }
                , extend : {
                              'form : watch' : () => 'input'
                            , 'form : define' : () => 'input'
                            , 'form : action' : () => [
                                {
                                      fn : (e) => console.log ( e.target )
                                    , type : 'input'
                                    , mode : 'in'
                                }
                            ]
                    }
      }


let short = shortcuts ();



describe ( 'Click plugin', () => {



      beforeEach ( async  () => {
                    short.load ( contextDefinition )
                    let container = document.createElement ( 'div' );
                    container.id = 'app'
                    document.body.appendChild ( container )
                    await html.publish ( Block, {}, 'app' )
                     a = false, b = false, c = null, d = null
          }) // beforeEach


      afterEach ( async  () => {
                  short.reset ();
                  short.disablePlugin ( 'click' )
                  html.destroy ();
                   a = false, b = false, c = null, d = null;
                  document.body.querySelector ( '#app' ).remove ()
          }) // afterEach



      afterEach ( async  () => {
                  short.reset ();
                   a = false, b = false, c = null, d = null;
          }) // afterEach



      it ( 'No "click" plugin installed', async () => {
                          let r = short.listShortcuts ('touch');
                          // Shortcuts are untouched if plugin is not installed
                          expect ( r[0]).to.equal ( ' click: left-1' )
          }) // it no 'click' plugin installed



      it ( 'Click plugin installed', async () => {
                          short.enablePlugin ( pluginClick )
                          let r = short.listShortcuts ( 'touch' );
                          // Shortcuts are normalized
                          expect ( r[0]).to.equal ( 'CLICK:LEFT-1' )
          }) // it click plugin installed



      it ( 'Single left click', async () => {
                          expect ( b ).to.equal ( false )
                          short.enablePlugin ( pluginClick )
                          short.changeContext ( 'touch' )
                          await userEvent.click ( document.querySelector ( '#rspan' ) )
                          await wait ( 330 )
                          await waitFor ( () => {
                                    expect ( b ).to.equal ( true )
                                    // Target is a element that contains data-click property!
                                    expect ( c ).to.equal ( 'red' )
                                    // We clicked on span, but target is the parent element
                                    // that contains data-click property
                              }, { timeout: 1000, interval: 12 })
          }) // it single left click



      it ( 'Double left click', async () => {
                          expect ( b ).to.equal ( false )
                          short.enablePlugin ( pluginClick )
                          short.changeContext ( 'touch' )
                          await userEvent.dblClick ( document.querySelector ( '#rspan' ) )
                          await wait ( 20 )
                          // Default wait mouse timeout is 320 ms, but maxClicks is set to 2, 
                          // so we don't need to wait for timeout
                          await waitFor ( () => {
                                    expect ( b ).to.equal ( true )
                                    // Target is a element that contains data-click property!
                                    expect ( c ).to.equal ( 'red' )
                                    // We clicked on span, but target is the parent element
                                    // that contains data-click property
                              }, { timeout: 1000, interval: 12 })
          }) // it double left click



      it ( 'Triple left click', async () => {
                          short.enablePlugin ( pluginClick )
                          const hitItem = document.querySelector ( '#rspan' );
                          expect ( a ).to.equal ( false )
                          short.changeContext ( 'touch' )
                          // Load will restart the selected context
                          short.load ({ 
                                      // load will overwrite existing 'touch' context definition
                                      'touch' : {   
                                                  'click: left-3' : () => a = true
                                              } 
                                })
                          await wait ( 12 )
                          await userEvent.tripleClick ( hitItem )
                          // Default wait mouse timeout is 320 ms, but maxClicks is set to 3, 
                          // so we don't need to wait for timeout
                           await waitFor ( () => {
                                     expect ( a ).to.equal ( true )
                                     expect ( b ).to.equal ( false )
                               }, { timeout: 1000, interval: 12 })
                           // Now click again during the ignore period - should be ignored
                           await userEvent.click ( hitItem )
                           await wait ( 50 )
                           // Should still be a = true, b = false
                           expect ( a ).to.equal ( true )
                           expect ( b ).to.equal ( false )
           }) // it triple left click



      it ( 'Single right click', async () => {
                          short.enablePlugin ( pluginClick )
                          // Context 'touch' was changed during previous test
                          // Return to original context. 
                          short.load ( contextDefinition )
                          short.changeContext ( 'touch' )
                          let find = null
                          await waitFor ( () => {
                                      find = document.querySelector ( '#rspan' )              
                              },{ timeout: 1000, interval: 12 })
                          if ( find ) await userEvent.click ( find , { button:'right' }) 
                          // Default wait mouse timeout is 320 ms
                        //   await wait ( 320 )
                          await waitFor ( () => {
                                    expect ( c ).to.equal ( 'right' )
                              }, { timeout: 1000, interval: 12 })
            }) // it single right click



       it ( 'Double right click', async () => {
                           short.enablePlugin ( pluginClick )
                           short.changeContext ( 'touch' )
                           // Load context with double right click
                           short.load ({
                                       'touch' : {
                                                   'click: right-2' : () => d = 'double right'
                                               }
                                 })
                           await wait ( 12 )
                           const hitItem = document.querySelector ( '#rspan' );
                           expect ( d ).to.equal ( null )
                           // Simulate double right click
                           await userEvent.dblClick ( hitItem , { button:'right' })
                           await waitFor ( () => {
                                     expect ( d ).to.equal ( 'double right' )
                               }, { timeout: 1000, interval: 12 })
           }) // it double right click



      it ( 'Ignore clicks on elements that are not a target', async () => {
                            short.enablePlugin ( pluginClick )
                            let 
                                hidden = document.getElementById ( 'hidden' )
                              , name = document.getElementById ( 'name' )
                              , hitItem = document.querySelector ( '#rspan' )
                              ;
                            hidden.classList.remove ( 'hide' )
                            short.changeContext ( 'touch' )

                            // Click on element without data-click property. Should be ignored
                            await userEvent.click ( name , { button:'right' })
                            // Click on element with data-click property
                            await userEvent.click ( hitItem , { button:'right' })
                            await wait ( 330 )
                            await waitFor ( () => {
                                      // Click should be read as single right click
                                      expect ( c ).to.equal ( 'right' )                                    
                              }, { timeout: 1000, interval: 12 })
            }) // it ignore clicks on elements that are not a target


      
      it ( 'Multiple right clicks', async () => {
                            short.enablePlugin ( pluginClick )
                            // Reload because in testcase 'Double right click' context  'touch' was changed;
                            short.load ( contextDefinition )
                            let hitItem = document.querySelector ( '#rspan' );
                            short.changeContext ( 'touch' )
                            
                            await userEvent.click ( hitItem , { button:'right' })
                            await userEvent.click ( hitItem , { button:'right' })
                            // This click should be ignored
                            await userEvent.click ( hitItem , { button:'right' })
                            await wait ( 330 )
                            await userEvent.click ( hitItem , { button:'right' })
                            
                            await wait ( 500 )
                            await waitFor ( () => {
                                      // Click should be read as double right click, then single right click
                                      expect ( c ).to.equal ( 'right' )
                                      expect ( d ).to.equal ( 'clicked' )                                    
                              }, { timeout: 1000, interval: 12 })
            }) // it multiple right clicks



         it ( 'Click with modifiers', async () => {
                            short.enablePlugin ( pluginClick )
                            short.changeContext ( 'touch' )
                            let r = short.listShortcuts ('touch');
                            expect ( r ).to.include ( 'CLICK:LEFT-1-ALT' )
                            const hitItem = document.querySelector ( '.block' );
                            // Click with alt key - should trigger the alt shortcut
                            fireEvent.click ( hitItem , { altKey: true } )
                            await wait ( 330 )
                            // Callback should be triggered
                            expect ( d ).to.equal ( 'alt-clicked' )
            }) // it click with modifiers


         it ( 'Click on document body - no target found', async () => {
                            short.enablePlugin ( pluginClick )
                            short.changeContext ( 'touch' )
                            fireEvent.click ( document.body )
                            await wait ( 330 )
                            // No callback should be triggered since no target
                            expect ( b ).to.equal ( false )
            }) // it click on document body


         it ( 'Click with ctrl modifier', async () => {
                            short.enablePlugin ( pluginClick )
                            short.changeContext ( 'touch' )
                            let r = short.listShortcuts ('touch');
                            expect ( r ).to.include ( 'CLICK:LEFT-1-CTRL' )
                            const hitItem = document.querySelector ( '.block' );
                            // Click with ctrl key - should trigger the ctrl shortcut
                            fireEvent.click ( hitItem , { ctrlKey: true } )
                            await wait ( 330 )
                            // Callback should be triggered
                            expect ( d ).to.equal ( 'ctrl-clicked' )
            }) // it click with ctrl modifier


         it ( 'Click with shift modifier', async () => {
                            short.enablePlugin ( pluginClick )
                            short.changeContext ( 'touch' )
                            let r = short.listShortcuts ('touch');
                            expect ( r ).to.include ( 'CLICK:LEFT-1-SHIFT' )
                            const hitItem = document.querySelector ( '.block' );
                            // Click with shift key - should trigger the shift shortcut
                            fireEvent.click ( hitItem , { shiftKey: true } )
                            await wait ( 330 )
                            // Callback should be triggered
                            expect ( d ).to.equal ( 'shift-clicked' )
            }) // it click with shift modifier



        it ( 'Arguments of click handler', async () => {
                 /**
                 *    Need to know arguments for 'click' handler
                 *    function myMouseHandler ({
                 *                         context     // (string) Name of the current context;
                 *                       , note        // (string) Name of the note or null if note isn't set;
                 *                       , dependencies // (object) Object with dependencies that you have set by calling `setDependencies` method;
                 *                       , target      // (DOM element). Target element of the mouse event;
                 *                       , targetProps // (object). Coordinates of the target element (top, left, right, bottom, width, height) or null if target element is not available;
                 *                       , x           // (number). X coordinate of the target element;
                 *                       , y           // (number). Y coordinate of the target element;
                 *                       , event       // (object). Original mouse event object;
                 *                  }) {
                 *            // Body of the handler. Do something...
                 *       }
                 */
                 // Ensure clean state for this test
                 let megaBtn = document.querySelector ( '[data-click="mega"]' )
                 let test = [];
                 let i = 0;
                short.enablePlugin ( pluginClick )
                short.setDependencies ({ test })
                short.load ({
                        'local' : {
                              'click: left-1' : ({ 
                                                        dependencies
                                                      , target
                                                      , x
                                                      , y
                                                      , targetProps
                                                      , context 
                                                }) => {
                                                      const 
                                                          { test } = dependencies
                                                          , result = {
                                                                    x
                                                                  , y
                                                                  , targetProps
                                                                  , context
                                                                  }
                                                          ;
                                                      result.target = target.dataset.click
                                                      test.push ( result )
                                                      i++
                                                }
                            } // local
                      })
                 short.changeContext ( 'local' )
                 expect ( megaBtn ).to.not.be.null
                 await userEvent.click ( megaBtn )
                 await wait ( 50 )  // Wait for click processing
                 await waitFor ( () => {
                              expect ( i ).to.be.equal ( 1 )      
                              let result = test[0];
                              expect ( result.target ).to.be.equal ( 'mega' )
                              expect ( result.context ).to.be.equal ( 'local' )
                        }, { timeout: 1000, interval: 12 })
          }) // it arguments of click handler



      it ( 'Click on anchor', async () => {
                        // Click on anchor that don't have click-data attribute.
                        let result = 'none';
                        short.enablePlugin ( pluginClick )
                        short.load ({ 'extra' : { 
                                                'click: 1 - left' : ({target, context, event }) => {   // Order of button name and number of click is not important
                                                            event.preventDefault ()
                                                            expect ( context ).to.be.equal ( 'extra' )
                                                            expect ( target.nodeName ).to.be.equal ( 'A' )
                                                            result = target.nodeName
                                                            }
                                                } 
                                    })
                        short.changeContext ( 'extra' )
                        let loc = document.querySelector ( '#anchor' )  || false;
                        if ( loc )   await userEvent.click ( loc )
                        expect ( result ).to.be.equal ( 'A' )  
          }) // it click on anchor



      it ( 'Mute and unmute click plugin', async () => {
                        const 
                              result = []
                        , trg = document.querySelector ( '#rspan' ) 
                        ;
                        
                        let i = 0;
                        result.push ( 'init' )

                        
                        short.load ({
                              'local' : {
                                    'click: left-1 ' : ({dependencies}) => {
                                                let { result } = dependencies;
                                                result.push ( i++ )
                                          }
                                    }
                              })
                        short.setDependencies ({ result })
                        short.enablePlugin ( pluginClick )
                        short.changeContext ( 'local' )


                        await userEvent.click ( trg )
                        await wait( 330 )
                        await waitFor ( () => {
                              // We checking if the shortcut works
                              expect ( result ).to.have.lengthOf ( 2 )
                              expect ( i ).to.equal ( 1 )
                        }, { timeout: 1000, interval: 12 })

                        short.mutePlugin ( 'click' )

                        await userEvent.click ( trg )
                        await waitFor ( () => {
                                    // Plugin is muted, so we don't expect any changes
                                    expect ( result ).to.have.lengthOf ( 2 )
                                    expect ( i ).to.equal ( 1 )
                              }, { timeout: 1000, interval: 12 })

                        short.unmutePlugin ( 'click' )

                        await userEvent.click ( trg )
                        await wait ( 330 )
                        await waitFor ( () => {
                                    // Plugin is unmuted, should work again
                                    expect ( result ).to.have.lengthOf ( 3 )
                                    expect ( i ).to.equal ( 2 )
                              }, { timeout: 1000, interval: 12 })
               }) // it mute and unmute click plugin



      it ( 'Pause and resume', async () => {
                        let target = document.querySelector ( '#rspan' )
                        short.enablePlugin ( pluginClick )
                        expect ( b ).to.be.equal ( false )
                        short.changeContext ( 'touch' )
                        short.pause ( 'click: left-1' )
                        await userEvent.click ( target )
                        await wait ( 400 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( false )
                              }, { timeout: 1000, interval: 30 })
                        short.resume ( 'click: left-1' )
                        await userEvent.click ( target )
                        await wait ( 400 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( true )
                                    expect ( c ).to.be.equal ( 'red' )
                             }, { timeout: 1000, interval: 30 })
              }) // it pause and resume
  
}) // describe