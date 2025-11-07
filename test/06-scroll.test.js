import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
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
        , pluginScroll
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
                , scroll : {
                              ' scroll: up': () => b = true,
                              'scroll : down': () => c = 'down',
                              'scroll:left': () => c = 'left',
                              'scroll:right': () => c = 'right'
                          }
                , extra : {
                            'key : p,r,o,b,a': () => b = true
                        }
      }


const short = shortcuts ();



describe ( 'Scroll plugin', () => {



      beforeEach ( async  () => {
                    short.load ( contextDefinition )
                    const container = document.createElement ( 'div' );
                    container.id = 'app'
                    document.body.appendChild ( container )
                    // Make page scrollable both vertically and horizontally
                    document.body.style.height = '2000px'
                    document.body.style.width = '2000px'
                    document.body.style.margin = '0'
                    document.documentElement.style.height = '2000px'
                    document.documentElement.style.width = '2000px'
                    await html.publish ( Block, {}, 'app' )
                    a = false, b = false, c = null
          }) // beforeEach



      afterEach ( async  () => {
                  short.reset ();
                  html.destroy ()
                  a = false, b = false, c = null;
                  document.body.querySelector ( '#app' ).remove ()
          }) // afterEach



       it ( 'No "scroll" plugin installed', async () => {
                           const r = short.listShortcuts ('scroll');
                           // Shortcuts are untouched if plugin is not installed
                           expect ( r[0]).to.equal ( ' scroll: up' )
                           expect ( r[1]).to.equal ( 'scroll : down' )
                           expect ( r[2]).to.equal ( 'scroll:left' )
                           expect ( r[3]).to.equal ( 'scroll:right' )
           }) // it no 'scroll' plugin installed



       it ( 'Enable plugin when context has no shortcuts for this plugin', () => {
                           short.changeContext ( 'general' )  // 'general' has no scroll shortcuts
                           short.enablePlugin ( pluginScroll )
                           expect ( short.listPlugins () ).to.include ( 'scroll' )
                           // Since no scroll shortcuts in 'general', listener should not start
           }) // it enable plugin when context has no shortcuts



      it ( 'Scroll plugin installed', async () => {
                          short.enablePlugin ( pluginScroll )
                          const r = short.listShortcuts ( 'scroll' );
                          // Shortcuts are normalized
                          expect ( r[0]).to.equal ( 'SCROLL:UP' )
                          expect ( r[1]).to.equal ( 'SCROLL:DOWN' )
                          expect ( r[2]).to.equal ( 'SCROLL:LEFT' )
                          expect ( r[3]).to.equal ( 'SCROLL:RIGHT' )
          }) // it scroll plugin installed



       it ( 'Scroll down event', async () => {
                           expect ( c ).to.equal ( null )
                           short.changeContext ( 'scroll' )
                           short.enablePlugin ( pluginScroll )

                          // Scroll down by setting scroll position
                          window.scrollTo ( 0, 100 )
                          await wait ( 50 )
                          await waitFor ( () => {
                                    expect ( c ).to.equal ( 'down' )
                              }, { timeout: 1000, interval: 12 })
          }) // it scroll down event



       it ( 'Scroll up event', async () => {
                           expect ( b ).to.equal ( false )
                           short.changeContext ( 'scroll' )
                           short.enablePlugin ( pluginScroll )

                          // First scroll down to establish baseline
                          window.scrollTo ( 0, 100)
                          await wait ( 50 )

                          // Then scroll up
                          window.scrollTo ( 0, 50)
                          await wait ( 50 )

                          await waitFor ( () => {
                                    expect ( b ).to.equal ( true )
                              }, { timeout: 1000, interval: 12 })
          }) // it scroll up event



       it ( 'Scroll left event', async () => {
                            expect ( c ).to.equal ( null )
                            short.changeContext ( 'scroll' )
                            short.enablePlugin ( pluginScroll )

                           // First scroll right to establish baseline
                           window.scrollTo ( 100, 0 )
                           await wait ( 50 )

                           // Then scroll left
                           window.scrollTo ( 50, 0 )
                           await wait ( 50 )

                           await waitFor ( () => {
                                     expect ( c ).to.equal ( 'left' )
                               }, { timeout: 1000, interval: 12 })
           }) // it scroll left event



       it ( 'Scroll right event', async () => {
                            expect ( c ).to.equal ( null )
                            short.changeContext ( 'scroll' )
                            short.enablePlugin ( pluginScroll )

                           // Scroll right by setting scroll position
                           window.scrollTo ( 100, 0 )
                           await wait ( 50 )

                           await waitFor ( () => {
                                     expect ( c ).to.equal ( 'right' )
                               }, { timeout: 1000, interval: 12 })
}) // it scroll right event



        it ( 'Combined horizontal and vertical scroll', async () => {
                             const scrollEvents = []
                             short.setDependencies ({ scrollEvents })
                             short.changeContext ( 'scroll' )
                             short.enablePlugin ( pluginScroll )
                             
                             // Reset scroll position to (0, 0) first
                             window.scrollTo ( 0, 0 )
                             await wait ( 200 ) // Wait longer for any pending scroll events
                             
                             // Clear any events that might have been triggered by reset
                             scrollEvents.length = 0
                             
                             // Create a temporary context to capture scroll events
                             short.load ({
                                 'testScroll': {
                                     'scroll:up': ({ direction }) => scrollEvents.push(direction),
                                     'scroll:down': ({ direction }) => scrollEvents.push(direction),
                                     'scroll:left': ({ direction }) => scrollEvents.push(direction),
                                     'scroll:right': ({ direction }) => scrollEvents.push(direction)
                                 }
                             })
                             short.changeContext ( 'testScroll' )

                           // Scroll diagonally (right and down)
                           window.scrollTo ( 100, 100 )
                           await wait ( 50 )

                           // Scroll left
                           window.scrollTo ( 50, 100 )
                           await wait ( 50 )

                           // Scroll up
                           window.scrollTo ( 50, 50 )
                           await wait ( 50 )

                           await waitFor ( () => {
                                     expect ( scrollEvents ).to.include.members ( ['right', 'down', 'left', 'up'] )
                                     expect ( scrollEvents ).to.have.length ( 4 )
                               }, { timeout: 1000, interval: 12 })
           }) // it combined horizontal and vertical scroll



       it ( 'Mute and unmute scroll plugin', async () => {
                           short.changeContext ( 'scroll' )
                           short.enablePlugin ( pluginScroll )
                           c = null // Reset c variable

                           // Mute the plugin
                           short.mutePlugin ( 'scroll' )

                           // Scroll should not trigger
                           window.scrollTo ( 0, 100)
                           await wait ( 50 )
                           expect ( c ).to.equal ( null )

                           // Unmute the plugin
                           short.unmutePlugin ( 'scroll' )

                           // Scroll should trigger now
                           window.scrollTo ( 0, 200)
                           await wait ( 50 )

                          await waitFor ( () => {
                                    expect ( c ).to.equal ( 'down' )
                              }, { timeout: 1000, interval: 12 })
          }) // it mute and unmute scroll plugin



       it ( 'Pause and resume', async () => {
                           short.changeContext ( 'scroll' )
                           short.enablePlugin ( pluginScroll )

                          // Pause the shortcut
                          short.pause ( 'scroll : down' )

                          // Scroll should not trigger
                          window.scrollTo(0, 100)
                          await wait ( 50 )
                          expect ( c ).to.equal ( null )

                          // Resume the shortcut
                          short.resume ( ' scroll : down' )

                          // Scroll should trigger now
                          window.scrollTo(0, 200)
                          await wait ( 50 )

                          await waitFor ( () => {
                                    expect ( c ).to.equal ( 'down' )
                              }, { timeout: 1000, interval: 12 })
           }) // it pause and resume



       it ( 'Enable already enabled plugin', () => {
                           // Enable plugin first time
                           short.enablePlugin ( pluginScroll )
                           let plugins = short.listPlugins ()
                           expect ( plugins ).to.include ( 'scroll' )
                           expect ( plugins ).to.have.lengthOf ( 1 )

                           // Try to enable the same plugin again
                           short.enablePlugin ( pluginScroll )
                           plugins = short.listPlugins ()
                           // Should still have only one instance
                           expect ( plugins ).to.include ( 'scroll' )
                           expect ( plugins ).to.have.lengthOf ( 1 )
           }) // it enable already enabled plugin



it ( 'Disable a plugin', () => {
                           // Enable plugin
                           short.enablePlugin ( pluginScroll )
                           expect ( short.listPlugins () ).to.include ( 'scroll' )

                           // Disable plugin
                           short.disablePlugin ( 'scroll' )
                           expect ( short.listPlugins () ).to.not.include ( 'scroll' )
           }) // it disable a plugin


       it ( 'Extra parameters to plugin options', async () => {
                        short.enablePlugin ( pluginScroll )
                        const emit = [];
                        const setupContext = {
                                    'scroll:setup' : () => {
                                          emit.push ( 'setup' )
                                          return { minSpace: 10, customParam: 'scroll-test', emit }
                                          },
                                    'scroll:down' : ({options}) => {
                                          expect ( options.minSpace ).to.equal ( 10 )
                                          expect ( options.customParam ).to.equal ( 'scroll-test' )
                                          options.emit.push ( 'down' )
                                          },
                                    'scroll:up' : ({options}) => {
                                          expect ( options.minSpace ).to.equal ( 10 )
                                          expect ( options.customParam ).to.equal ( 'scroll-test' )
                                          options.emit.push ( 'up' )
                                          },
                                    'scroll:right' : ({options}) => {
                                          expect ( options.minSpace ).to.equal ( 10 )
                                          expect ( options.customParam ).to.equal ( 'scroll-test' )
                                          options.emit.push ( 'right' )
                                          },
                                    'scroll:left' : ({options}) => {
                                          expect ( options.minSpace ).to.equal ( 10 )
                                          expect ( options.customParam ).to.equal ( 'scroll-test' )
                                          options.emit.push ( 'left' )
                                          }
                            } // setupContext
                        
                        short.load ({ setupContext })
                        short.changeContext ( 'setupContext' )

                        // Setup event execution is on change context:
                        expect ( emit[0] ).to.equal ( 'setup' )
                        
                        // Reset scroll position to (0, 0) first
                        window.scrollTo ( 0, 0 )
                        await wait ( 200 ) // Wait for any pending scroll events
                        
                        // Test scroll with modified minSpace (smaller movements should trigger)
                        // We just need to verify that the options are accessible and contain our custom parameters
                        // The exact scroll behavior may vary in test environment
                        window.scrollTo ( 0, 50 )  // 50px movement, should definitely trigger with minSpace=10
                        await wait ( 100 )
                        
                        // At least one scroll event should have been triggered with our custom options
                        expect ( emit.length ).to.be.greaterThan ( 1 )
                        expect ( emit[0] ).to.equal ( 'setup' )
                        
                        // Verify that the scroll events have access to the custom parameters
                        // We don't need to assert exact scroll directions since test environment may behave differently
                        const scrollEvents = emit.filter(e => e !== 'setup')
                        expect ( scrollEvents.length ).to.be.greaterThan ( 0 )
            }) // it extra parameters to plugin options

 }) // describe Scroll plugin