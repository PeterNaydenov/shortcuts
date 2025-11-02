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
                              'scroll : down': () => c = 'down'
                          }
                , extra : {
                            'key : p,r,o,b,a': () => b = true
                        }
      }


let short = shortcuts ();



describe ( 'Scroll plugin', () => {



      beforeEach ( async  () => {
                    short.load ( contextDefinition )
                    let container = document.createElement ( 'div' );
                    container.id = 'app'
                    document.body.appendChild ( container )
                    // Make page scrollable
                    document.body.style.height = '2000px'
                    document.body.style.margin = '0'
                    document.documentElement.style.height = '2000px'
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
                           let r = short.listShortcuts ('scroll');
                           // Shortcuts are untouched if plugin is not installed
                           expect ( r[0]).to.equal ( ' scroll: up' )
                           expect ( r[1]).to.equal ( 'scroll : down' )
           }) // it no 'scroll' plugin installed



       it ( 'Enable plugin when context has no shortcuts for this plugin', () => {
                           short.changeContext ( 'general' )  // 'general' has no scroll shortcuts
                           short.enablePlugin ( pluginScroll )
                           expect ( short.listPlugins () ).to.include ( 'scroll' )
                           // Since no scroll shortcuts in 'general', listener should not start
           }) // it enable plugin when context has no shortcuts



      it ( 'Scroll plugin installed', async () => {
                          short.enablePlugin ( pluginScroll )
                          let r = short.listShortcuts ( 'scroll' );
                          // Shortcuts are normalized
                          expect ( r[0]).to.equal ( 'SCROLL:UP' )
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



       it ( 'Mute and unmute scroll plugin', async () => {
                           short.changeContext ( 'scroll' )
                           short.enablePlugin ( pluginScroll )

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
                           // Enable the plugin
                           short.enablePlugin ( pluginScroll )
                           expect ( short.listPlugins () ).to.include ( 'scroll' )

                           // Disable the plugin
                           short.disablePlugin ( 'scroll' )
                           expect ( short.listPlugins () ).to.not.include ( 'scroll' )
           }) // it disable a plugin

}) // describe Scroll plugin