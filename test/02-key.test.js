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
import Block             from '../test-helpers/Block.jsx'
import VisaulController  from '@peter.naydenov/visual-controller-for-react'
import wait              from '../test-helpers/wait.js'
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
                              'click: left-1': () => b = true,
                              // Double click with left button
                              'click: left-2': () => b = true,
                              // Single click with right button
                              'click: right-1': () => b = true
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





describe ( 'Key plugin', () => {

      beforeEach ( async  () => {
                    short.load ( contextDefinition )
                    let container = document.createElement ( 'div' )
                    container.id = 'app'
                    document.body.appendChild ( container )
                    await html.publish ( Block, {}, 'app' )
                    a = false, b = false
          }) // beforeEach



      afterEach ( async  () => {
                  short.reset ()
                  a = false, b = false, c = null;
          }) // afterEach



      it ( 'No "key" plugin installed', () => {
                          let r = short.listShortcuts ('general');
                          // Shortcut name is the same as it was set
                          expect ( r[0]).to.equal ( ' key : shift+a' ) 
          }) // it no 'key' plugin installed



    it ( 'Key plugin installed', () => {
                          short.enablePlugin ( pluginKey )
                          const r = short.listShortcuts ( 'general' )
                          // Shortcut name is recognized by plugin and is normalized
                          expect ( r[0] ).to.equal ( 'KEY:A+SHIFT' ) 
        }) // it key plugin installed



    it ( 'Execute a key shortcut: shift+a', async () => {
                          expect ( a ).to.equal ( false )
                          // Enable key plugin, normalize shortcuts related to the plugin
                          short.enablePlugin ( pluginKey )
                          short.changeContext ( 'general' )
                          await userEvent.keyboard ( '{Shift>}A{/Shift}' ) // Write 'a' with shift
                          await wait ( 12 )
                          await waitFor ( () => {
                                    expect ( a ).to.equal ( true ) 
                                    expect ( c ).to.equal ( 'triggered' )       
                              }, { timeout: 1000, interval: 12 })
        }) // it execute a key shortcut



    it ( 'Key sequence', async () => {
                      // enable key plugin and normalize shortcuts related to the plugin 'key'
                      short.enablePlugin ( pluginKey )
                      short.changeContext ( 'extra' )
                      // Execute key sequence: 'p,r,o,b,a'
                      await userEvent.keyboard ( 'proba' )
                      await wait ( 12 )
                      await waitFor ( () => {
                                expect ( b ).to.equal ( true )
                      }, { timeout: 1000, interval: 12 })
        }) // it key sequence



    it ( 'Mute key plugin', async () => {
                          short.enablePlugin ( pluginKey )
                          const result = [];
                          let i = 0;
                          result.push ( 'init' )

                          short.setDependencies ({ result })
                          short.load ({
                                'local': {
                                        'key: g,t,i ' : ({dependencies}) => {
                                                  let { result } = dependencies;
                                                  result.push ( i++ )
                                              }
                                      }
                              })
                          
                          short.changeContext ( 'local' )
                          await userEvent.keyboard ( 'gti' )
                          await waitFor ( () => {
                                    // We checking if the shortcut works
                                    expect ( result ).to.have.lengthOf ( 2 )
                                    expect ( i ).to.equal ( 1 )
                              }, { timeout: 1000, interval: 12 })

                          short.mutePlugin ( 'key' )
                          await userEvent.keyboard ( 'gti' )
                          await waitFor ( () => {
                                    // Plugin is muted, so we don't expect any changes
                                    expect ( result ).to.have.lengthOf ( 2 )
                                    expect ( i ).to.equal ( 1 )
                              }, { timeout: 1000, interval: 12 })
        }) // it mute key plugin
    


    it ( 'Arguments of key handler', async () => {
                /**
                *    Need to know arguments for 'key' handler
                *    function myKeyHandler ({
                *                         wait        // (function). Function to pause key sequence processing
                *                       , end         // (function). Function to end key sequence processing
                *                       , ignore      // (function). Function to ignore current key in sequence
                *                       , isWaiting   // (function). Check if sequence is waiting
                *                       , note        // (string). Current context note or null
                *                       , context     // (string). Current context name
                *                       , dependencies // (object). External dependencies object
                *                       , type        // (string). Event type ('key')
                *                  }) {
                *            // Body of the handler. Do something...
                *       }
                */
                let test = [];
                let i = 0;
                short.enablePlugin ( pluginKey )
                short.setDependencies ({ test })
                short.load ({
                        'local' : {
                              'key: a' : ({
                                           wait
                                         , end
                                         , ignore
                                         , isWaiting
                                         , note
                                         , context
                                         , dependencies
                                         , type
                                       }) => {
                                                const
                                                    { test } = dependencies
                                                  , result = {
                                                                    wait: typeof wait
                                                                  , end: typeof end
                                                                  , ignore: typeof ignore
                                                                  , isWaiting: typeof isWaiting
                                                                  , note
                                                                  , context
                                                                  , type
                                                              }
                                                    ;
                                                test.push ( result )
                                                i++
                                          }
                            } // local
                      })
                short.changeContext ( 'local' )
                await userEvent.keyboard ( 'a' )
                await wait ( 50 )  // Wait for key processing
                await waitFor ( () => {
                            expect ( i ).to.be.equal ( 1 )
                            let result = test[0];
                            expect ( result.wait ).to.be.equal ( 'function' )
                            expect ( result.end ).to.be.equal ( 'function' )
                            expect ( result.ignore ).to.be.equal ( 'function' )
                            expect ( result.isWaiting ).to.be.equal ( 'function' )
                            expect ( result.context ).to.be.equal ( 'local' )
                            expect ( result.type ).to.be.equal ( 'key' )
                      }, { timeout: 1000, interval: 12 })
          }) // it arguments of key handler
    


})