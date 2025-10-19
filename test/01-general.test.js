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
import Block from '../test-helpers/Block.jsx'
import VisaulController from '@peter.naydenov/visual-controller-for-react'
import wait             from '../test-helpers/wait.js'
import { 
          pluginClick,
          pluginKey
        , pluginForm
        , shortcuts 
                } from '../src/main.js'


import askForPromise from 'ask-for-promise'

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
                                      ],
                            '@shortcuts-error' : ( m ) =>  c = m
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



describe ( "Shortcuts", () => {

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



        it ( 'Load and unload context', async () => {
                      let ls = short.listContexts ()
                      expect ( ls ).to.includes ( 'general' )

                      short.changeContext ( 'general' )
                      // Can't not to unload current active context - sends an error on @shortcuts-error
                      // @shortcuts-error is a system error event used accross the library
                      short.unload ( 'general' )
                      expect ( c ).to.be.equal ( `Context 'general' can't be removed during is current active context. Change the context first` )
                      
                      // Try to change context to non-existent one
                      // Message goes to @shortcuts-error                   
                      short.changeContext ( 'hhm' )
                      expect ( c ).to.be.equal ( `Context 'hhm' does not exist` )

                      // Change to something that exists
                      short.changeContext ( 'extra' )
                      // Free to unload 'general'
                      short.unload ( 'general' )
                      ls = short.listContexts ()
                      // Unload success
                      expect ( ls ).to.not.includes ( 'general' )
            }) // it load and unload context


        
        it ( 'List enabled plugins. Disable and enable plugins', async () => {
                     expect ( short.listPlugins () ).to.be.deep.equal ( [] )
                     // Enable list of plugins
                     let myPlugins = [ pluginKey, pluginClick ]
                     myPlugins.forEach ( plugin =>  short.enablePlugin ( plugin )   )
                     expect ( short.listPlugins () ).to.be.deep.equal ( [ 'key', 'click' ] )
                     // Method disablePlugin require plugin name (prefix)
                     short.disablePlugin ( 'click' )
                     expect ( short.listPlugins () ).to.be.deep.equal ( [ 'key' ] )
                     // Method enablePlugin require the plugin as a function
                     short.enablePlugin ( pluginClick )
                     expect ( short.listPlugins () ).to.be.deep.equal ( [ 'key', 'click' ] )
            }) // it list enabled plugins



        it ( 'Unload non existing context', () => {
                      let change = false;
                      let ls = short.listContexts ()
                      short.load ( {
                              local : {
                                      'click : leff-1' : () => console.log ( 'nothing' ),
                                      '@shortcuts-error': () => change = true
                                  }
                          })
                      short.changeContext ( 'local' )
                      short.unload ( 'unknown' )
                      expect ( change ).to.be.true
            }) // it unload non existing context
        
        
        
        it ( 'Emit custom event', () => {
                            // TODO: Check arguments for the custom event handlers
                            let result = null;
                            short.enablePlugin ( pluginClick )
                            const myAllContext = { 
                                                    myAll: {
                                                            'click : leff-1' : () =>  console.log ( 'nothing' )
                                                            , 'yo' : ({msg}) => result = msg
                                                        }}
                            short.load ( myAllContext )
                            short.changeContext ( 'myAll' )    
                            short.emit ( 'yo', { context: short.getContext(), note: 'tt', type:'custom', msg:'hello' })
                            expect ( result ).to.be.equal ( 'hello' )
                            short.changeContext ( 'general' )
                            short.unload ( 'myAll' )
            }) // it emit custom event



        it ( 'List shortcuts', () => {
                      short.enablePlugin ( pluginKey )

                      let general =  short.listShortcuts ('general');
                      expect ( general ).to.be.an ( 'array' )
                      expect ( general ).to.have.lengthOf ( 2 )
                      expect ( general ).to.include ( 'KEY:A+SHIFT' )
                      
                      let fail = short.listShortcuts ( 'somethingNotExisting' );
                      expect ( fail ).to.be.null
                  
                      let all = short.listShortcuts ();
                      expect ( all ).to.be.an ( 'array' )
                   
                      expect ( all ).to.have.lengthOf ( 4 )
                      // Property 'context' is a context name - string
                      expect ( all[0] ).to.have.property ( 'context' )
                      expect ( all[0] ).to.have.property ( 'shortcuts' )
                      expect ( all[0].shortcuts ).to.be.an ( 'array' )
                      expect ( all[0].shortcuts ).to.have.lengthOf ( 2 )
                      expect ( all[0].shortcuts ).to.include ( 'KEY:A+SHIFT' )
                      expect ( all[0].context ).to.be.equal ( 'general' )
            }) // it list shortcuts



        it ( 'Reset', () => {
                      short.enablePlugin ( pluginKey )
                      short.reset ()
                      expect ( short.listShortcuts () ).to.have.lengthOf ( 0 )
                      expect ( short.listShortcuts () ).to.have.lengthOf ( 0 )
                      expect ( short.getContext () ).to.be.null
            }) // it Reset
        

}) // describe

