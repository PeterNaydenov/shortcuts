import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { vi } from 'vitest'
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
        , pluginHover
                } from '../src/main.js'



const html = new VisaulController ();
let
       a = false
     , b = false
     , c = null
     ;

const contextDefinition = {
                  general : {
                            ' key : shift+a': [ 
                                        () => a = true, 
                                        () => c = 'triggered' 
                                      ]
                        }
                , touch : {
                              // Mouse on
                              ' hover : on': ({ target }) => {
                                                b = true
                                                // Named argument 'target' should be available
                                                if ( target?.dataset?.hover )   c = target?.dataset?.hover
                                          },
                              // Mouse off
                              'hover: off': ({ target }) => {
                                                b = false
                                                if ( target?.dataset?.hover )   c = target.dataset.hover
                                          }
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
                                  , timing : 'in'
                              }
                          ]
                    }
      }


let short = shortcuts ();



describe ( 'Hover plugin', () => {



      beforeEach ( async  () => {
                    short.load ( contextDefinition )
                    let container = document.createElement ( 'div' );
                    container.id = 'app'
                    document.body.appendChild ( container )
                    await html.publish ( Block, {}, 'app' )
                    a = false, b = false
          }) // beforeEach



      afterEach ( async  () => {
                  short.reset ();
                  a = false, b = false, c = null;
          }) // afterEach



      it ( 'No "hover" plugin installed', async () => {
                          let r = short.listShortcuts ('touch');
                          // Shortcuts are untouched if plugin is not installed
                          expect ( r[0]).to.equal ( ' hover : on' )
          }) // it no 'hover' plugin installed



      it ( 'Hover plugin installed', async () => {
                          short.enablePlugin ( pluginHover )
                          let r = short.listShortcuts ( 'touch' );
                          // Shortcuts are normalized
                          expect ( r[0]).to.equal ( 'HOVER:ON' )
          }) // it hover plugin installed



      it ( 'Mouse on', async () => {
                          expect ( b ).to.equal ( false )
                          short.enablePlugin ( pluginHover )
                          short.changeContext ( 'touch' )
                          await userEvent.hover ( document.querySelector ( '#rspan' ) )
                          await wait ( 320 )
                          await waitFor ( () => {
                                    expect ( b ).to.equal ( true )
                                    // Target is a element that contains data-hover property!
                                    expect ( c ).to.equal ( 'red' )
                                    // We hovered on span, but target is the parent element
                                    // that contains data-hover property
                              }, { timeout: 1000, interval: 12 })
          }) // it mouse on



      it ( 'Mouse off', async () => {
                          short.enablePlugin ( pluginHover )
                          short.changeContext ( 'touch' )
                          const hoverElement = document.querySelector ( '#rspan' );
                          await userEvent.hover ( hoverElement )
                          await wait ( 320 )
                          await waitFor ( () => {
                                    expect ( b ).to.equal ( true )
                                    expect ( c ).to.equal ( 'red' )      
                              }, { timeout: 1000, interval: 12 })
                          // Simulate off by hovering another element
                        //   await userEvent.hover ( document.body )
                          let unhoverToInput = document.querySelector ( '#name' );
                          await userEvent.hover ( unhoverToInput )
                          await wait ( 320 )
                          await waitFor ( () => {
                                    expect ( b ).to.equal ( false )
                                    expect ( c ).to.equal ( 'red' )
                              }, { timeout: 1000, interval: 12 })
          }) // it mouse off



      it ( 'Arguments of hover handler', async () => {
                 /**
                 *    Need to know arguments for 'hover' handler
                 *    function myHoverHandler ({
                 *                         context     // (string) Name of the current context;
                 *                       , note        // (string) Name of the note or null if note isn't set;
                 *                       , dependencies // (object) Object with dependencies that you have set by calling `setDependencies` method;
                 *                       , target      // (DOM element). Target element of the hover event;
                 *                       , targetProps // (object). Coordinates of the target element (top, left, right, bottom, width, height) or null if target element is not available;
                 *                       , x           // (number). X coordinate of the target element;
                 *                       , y           // (number). Y coordinate of the target element;
                 *                       , event       // (object). Original hover event object;
                 *                  }) {
                 *            // Body of the handler. Do something...
                 *       }
                 */
                 // Ensure clean state for this test
                 let megaBtn = document.querySelector ( '[data-click="mega"]' )
                 let test = [];
                 let i = 0;
                short.enablePlugin ( pluginHover )
                short.setDependencies ({ test })
                short.load ({
                        'local' : {
                              'hover : on' : ({
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
                                              result.target = target.dataset.hover
                                              test.push ( result )
                                              i++
                                            }
                            } // local
                      })
                 short.changeContext ( 'local' )
                 expect ( megaBtn ).to.not.be.null
                 await userEvent.hover ( megaBtn )
                 await wait ( 340 )  // Wait for hover processing
                 await waitFor ( () => {
                              expect ( i ).to.be.equal ( 1 )      
                              let result = test[0];
                              expect ( result.target ).to.be.equal ( 'blue' )
                              expect ( result.context ).to.be.equal ( 'local' )
                        }, { timeout: 1000, interval: 12 })
          }) // it arguments of hover handler



      it ( 'Hover on anchor', async () => {
                        // Hover on anchor that don't have hover-data attribute.
                        let result = 'none';
                        short.enablePlugin ( pluginHover )
                        short.load ({ 'extra' : {
                                                'hover : on' : ({target, context, event }) => {
                                                            expect ( context ).to.be.equal ( 'extra' )
                                                            expect ( target.nodeName ).to.be.equal ( 'DIV' )
                                                            result = target.nodeName
                                                          }
                                        }
                            })
                        short.changeContext ( 'extra' )
                        let loc = document.querySelector ( '#rspan' )  || false;
                        if ( loc )   await userEvent.hover ( loc )
                        await waitFor ( () => {
                                    expect ( result ).to.be.equal ( 'DIV' )        
                          }, { timeout: 1000, interval: 12 })
          }) // it hover on anchor



      it ( 'Mute and unmute hover plugin', async () => {
                        const 
                          result = []
                        , trg = document.querySelector ( '#rspan' )
                        , offTarget = document.querySelector ( '#name' ) 
                        ;
                        
                        let i = 0;
                        short.setDependencies ({ result })
                        result.push ( 'init' )
                        
                        
                        short.load ({
                              'local' : {
                                            'hover : on' : ({dependencies}) => {
                                                            let { result } = dependencies;
                                                            result.push ( i++ )
                                                        }
                                    }
                              })
                        
                        short.enablePlugin ( pluginHover )
                        short.changeContext ( 'local' )


                        await userEvent.hover ( trg )
                        await wait( 320 )
                        await waitFor ( () => {
                              // We checking if the shortcut works
                              expect ( result ).to.have.lengthOf ( 2 )
                              expect ( i ).to.equal ( 1 )
                        }, { timeout: 1000, interval: 12 })

                        short.mutePlugin ( 'hover' )
                        await userEvent.hover ( offTarget )
                        await userEvent.hover ( trg )

                        await wait ( 320 )
                        await waitFor ( () => {
                                    // Plugin is muted, so we don't expect any changes
                                    expect ( result ).to.have.lengthOf ( 2 )
                                    expect ( i ).to.equal ( 1 )
                              }, { timeout: 1000, interval: 12 })
                        

                        await userEvent.hover ( offTarget )
                        short.unmutePlugin ( 'hover' )
                        await userEvent.hover ( trg )

                        await wait ( 320 )                        
                        await waitFor ( () => {
                                    // Plugin is unmuted, should work again
                                    expect ( result ).to.have.lengthOf ( 3 )
                                    expect ( i ).to.equal ( 2 )
                              }, { timeout: 1000, interval: 12 })
               }) // it mute and unmute hover plugin



      it ( 'Pause and resume', async () => {
                        let 
                              target    = document.querySelector ( '#rspan' )
                            , targetOff = document.querySelector ( '#name' )
                            ;

                        short.enablePlugin ( pluginHover )
                        expect ( b ).to.be.equal ( false )

                        short.changeContext ( 'touch' )
                        short.pause ( 'hover : on' )

                        await userEvent.hover ( target )
                        await wait ( 100 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( false )
                              }, { timeout: 1000, interval: 30 })


                        await userEvent.hover ( targetOff )
                        short.resume ( 'hover : on' )

                        await userEvent.hover ( target )
                        await wait ( 100 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( true )
                                    expect ( c ).to.be.equal ( 'red' )
                             }, { timeout: 1000, interval: 30 })
            }) // it pause and resume



      it ( 'Fast move over hover target', async () => {
                        let 
                              target    = document.querySelector ( '#rspan' )
                            , targetOff = document.querySelector ( '#name' )
                            ;

                        short.enablePlugin ( pluginHover )
                        expect ( b ).to.be.equal ( false )

                        short.changeContext ( 'touch' )      
                        await userEvent.hover ( target )
                        await wait ( 200 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( false )
                              }, { timeout: 1000, interval: 30 })
                        
                        await userEvent.hover ( targetOff )
                        await wait ( 320 )
                        await waitFor ( () => {
                                    expect ( b ).to.be.equal ( false )
                              }, { timeout: 1000, interval: 30 })
            }) // it fast move over hover target

      
   
}) // describe