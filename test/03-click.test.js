import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
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
                              // Single click with right button
                              'click: right-1': () => c = 'right'
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


let short;


describe ( 'Click plugin', () => {



      beforeEach ( async  () => {
                    short = shortcuts ();
                    short.load ( contextDefinition )

                    let container = document.createElement ( 'div' );
                    container.id = 'app'
                    document.body.appendChild ( container )
                    await html.publish ( Block, {}, 'app' )
                    a = false, b = false
          }) // beforeEach



      afterEach ( async  () => {
                  short.destroy ();
                  a = false, b = false, c = null;
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
                          expect ( a ).to.equal ( false )
                          short.enablePlugin ( pluginClick )
                          short.changeContext ( 'touch' )
                          // Load will restart the selected context
                          short.load ({ 
                                      // load will overwrite existing 'touch' context definition
                                      'touch' : {   
                                                  'click: left-3' : () => a = true
                                              } 
                                }) 
                          await userEvent.tripleClick ( document.querySelector ( '#rspan' ) )
                          await wait ( 20 )
                          // Default wait mouse timeout is 320 ms, but maxClicks is set to 3, 
                          // so we don't need to wait for timeout
                          await waitFor ( () => {
                                    expect ( a ).to.equal ( true )
                                    expect ( b ).to.equal ( false )
                              }, { timeout: 1000, interval: 12 })
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
                          await wait ( 320 )
                          await waitFor ( () => {
                                    expect ( c ).to.equal ( 'right' )
                              }, { timeout: 1000, interval: 12 })
          }) // it single right click
        

      
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
                                                      console.log ( targetProps)
                                                      i++
                                                }
                            } // local
                      })
                short.changeContext ( 'local' )
                await userEvent.click ( document.querySelector ( '[data-click="mega"]' ) )
                expect ( i ).to.be.equal ( 1 )
                let result = test[0];
                expect ( result.target ).to.be.equal ( 'mega' )
                expect ( result.context ).to.be.equal ( 'local' )
          }) // it arguments of click handler
}) // describe