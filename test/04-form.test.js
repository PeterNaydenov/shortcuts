import { beforeEach, afterEach, describe, it, test, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
  fireEvent
} from '@testing-library/dom'



import '../test-helpers/style.css'
import Block            from '../test-helpers/Block.jsx'
import VisaulController from '@peter.naydenov/visual-controller-for-react'
import wait             from '../test-helpers/wait.js'
import { 
          shortcuts 
        , pluginClick
        , pluginKey
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
                                     , timing : 'in'
                                 }
                             ]
                    }
      }

const short = shortcuts ();



describe ( 'Form plugin', () => {

      beforeEach ( async  () => {
                        short.load ( contextDefinition )
                        const container = document.createElement ( 'div' )
                        container.id = 'app'
                        document.body.appendChild ( container )
                        await html.publish ( Block, {}, 'app' )
                        a = false, b = false
                }) // beforeEach



      afterEach ( async  () => {
                        html.destroy ()
                        short.reset ()
                        short.disablePlugin ( 'form' )
                        short.disablePlugin ( 'click' )
                        a = false, b = false, c = null;
                        document.body.querySelector ( '#app' ).remove ()
                }) // afterEach


                
      it ( 'Shortcut when plugin is not installed', async () => {
                        const ls = short.listShortcuts ( 'extend' )
                        expect ( ls ).to.includes ( 'form : action' )
                }) // it Shortcuts when plugin is not installed


                
      it ( 'Shortcuts when plugin is enabled', async () => {
                        short.enablePlugin ( pluginForm )
                        const ls = short.listShortcuts ( 'extend' )
                        expect ( ls ).to.includes ( 'FORM:WATCH' )
                        // Shortcut names are normalized by the plugins!               
                        expect ( ls ).to.not.includes ( 'form : watch' )                  
                }) // it Shortcuts when plugin is enabled



      it ( 'Simpler form listener. Only "form:action" defined', async () => {
                        // Uses predefined 'watch' and 'define' functions
                        short.enablePlugin ( pluginForm )
                        let edit = 'none';

                        const contextExtension = {
                                        'local' : {
                                                'form: action' : () => [{
                                                                        fn : () => edit = 'changed'
                                                                        , type : 'input'
                                                                        , timing : 'instant'
                                                                }]
                                        }
                                };
                        short.load ( contextExtension )
                        short.changeContext ( 'local' )
                        const input = document.getElementById ( 'name' )
                        input.focus ()
                        await userEvent.keyboard ( 'hello' )
                        await wait ( 50 )
                        await waitFor ( () => {
                                expect ( edit ).to.equal ( 'changed' )
                        }, { timeout: 1000, interval: 12 })
                }) // it Simpler form listener



        it ( 'Arguments for action function', async () => {
                         short.enablePlugin ( pluginForm )
                         const storage = [];
                         short.setDependencies ({ storage })
                         const contextExtension = {
                                         local: {
                                                         // Access to 'dependencies' on 'form:action' is available to optimize dev experience
                                                         // if many functions need access to it. Write ones, use everywhere.
                                                         'form:action' : ({ dependencies }) => [{ 
                                                                                 fn : ({ target }) => {
                                                                                        // dependencies are available here as named argument as well
                                                                                        // But if I have 20 actions, I need to add 20 times 'dependencies'
                                                                                         const { storage } = dependencies;
                                                                                         storage.push ({ target })
                                                                                     }
                                                                                 , type : 'input'
                                                                                 , timing : 'instant'
                                                                         }]
                                                 }
                                 } // contextExtension
                         short.load ( contextExtension )
                         short.changeContext ( 'local' )
                         const input = document.getElementById ( 'name' )
                         input.focus ()
                         await userEvent.keyboard ( 'hello' )
                         await wait ( 50 )
                         await waitFor ( () => {
                                 expect ( storage.length ).to.be.greaterThan ( 0 )
                                 const last = storage[storage.length - 1]
                                 expect ( last.target ).to.be.an.instanceof ( HTMLElement )
                                 expect ( last.target.value ).toBe ( 'hello' )
                         })
             }) // it arguments for action function


        
        it ( 'Arguments for "form:watch"', async () => {
                         short.enablePlugin ( pluginForm )
                         const storage = [];
                         short.setDependencies ({ storage })
                         const contextExtension = {
                                         local: {
                                                         'form:watch' : ({ dependencies }) => {
                                                                        const { storage } = dependencies;
                                                                        storage.push ( 'watch' )      
                                                                        return 'input'
                                                                },
                                                         'form:action' : ({ dependencies }) => [{ 
                                                                                 fn : ({ target }) => {
                                                                                         const { storage } = dependencies;
                                                                                         storage.push ({ target })
                                                                                     }
                                                                                 , type : 'input'
                                                                                 , timing : 'instant'
                                                                         }]
                                                 }
                                 } // contextExtension
                         short.load ( contextExtension )
                         short.changeContext ( 'local' )
                         const last = storage[storage.length - 1]
                         expect ( last ).to.equal ( 'watch' )
            }) // it arguments for "form:watch"
        

        
        it ( 'Arguments for "form:define"', async () => {
                         short.enablePlugin ( pluginForm )
                         const storage = [];
                         short.setDependencies ({ storage })
                         const contextExtension = {
                                         local: {
                                                         'form:define' : ({ dependencies, target }) => {
                                                                        const { storage } = dependencies;                                                                        
                                                                        storage.push ( 'define' )      
                                                                        return 'input'
                                                                },
                                                         'form:action' : ({ dependencies }) => [{ 
                                                                                 fn : ({ target }) => {
                                                                                         const { storage } = dependencies;
                                                                                         storage.push ({ target })
                                                                                     }
                                                                                 , type : 'input'
                                                                                 , timing : 'instant'
                                                                         }]
                                                 }
                                 } // contextExtension
                         short.load ( contextExtension )
                         short.changeContext ( 'local' )
                         const last = storage[storage.length - 1]
                         expect ( last ).to.equal ( 'define' )
            }) // it arguments for "form:watch"



        it ( 'Reveal and click', async () => {
                        // Clear any existing plugins first to ensure clean state
                        short.enablePlugin ( pluginForm )
                        const x = short.enablePlugin ( pluginClick )

                        let sum = 0;
                        const contextExtension = {
                                        reveal : {

                                                          'click : left-1': ({ dependencies, target }) => {
                                                                                if ( target.dataset.click === 'red' )    sum = 1
                                                                        } // click:left-1
                                                        , 'form:action' : ({ dependencies }) => [
                                                                        {
                                                                                fn : ({ target }) => {
                                                                                        // dependencies are available here as named argument as well
                                                                                        // But if I have 20 actions, I need to add 20 times 'dependencies'
                                                                                         if ( target.id === 'name' ) {
                                                                                                    const hidden = document.getElementById ( 'hidden' )
                                                                                                    hidden.classList.remove ( 'hide' )
                                                                                                } 
                                                                                     }
                                                                                , type : 'input'
                                                                                , timing : 'instant'
                                                                        }] // form:action
                                                }
                                };
                        short.load ( contextExtension )
                        short.changeContext ( 'reveal' )
                        const 
                             input = document.getElementById ( 'name' )
                           , hidden = document.getElementById ( 'hidden' )
                           , red = document.getElementById ( 'rspan' )
                           ;
                           
                        input.focus ()
                        await userEvent.keyboard ( 'hello' )
                        await waitFor ( () => {
                                        expect ( getComputedStyle(hidden).display ).to.not.equal ( 'none' )
                                })
                        // Wait for any pending timers from previous tests to clear
                        await wait ( 350 )
                
                        await userEvent.click ( red )
                        await wait ( 350 )
                        await waitFor ( () => {
                                        // console.log ( sum )
                                        expect ( sum ).to.equal ( 1 )
                                }, { timeout: 1000, interval: 12 })
}) // it Reveal and click

       
        it ( 'Extra parameters to plugin options', async () => {
                        short.enablePlugin ( pluginForm )
                        const emit = [];
                        const setupContext = {
                                    'form:setup' : () => {
                                          emit.push ( 'setup' )
                                          return { wait: 100, customParam: 'test-value', emit }
                                          },
                                    'form:watch' : () => 'input',
                                    'form:action' : ({options}) => {
                                          expect ( options.wait ).to.equal ( 100 )
                                          expect ( options.customParam ).to.equal ( 'test-value' )
                                          options.emit.push ( 'action' )
                                          return [{
                                                  fn : ({ target }) => {
                                                          // Action function that uses options
                                                          expect ( options.wait ).to.equal ( 100 )
                                                          expect ( options.customParam ).to.equal ( 'test-value' )
                                                          options.emit.push ( 'executed' )
                                                  }
                                                , type : 'input'
                                                , timing : 'instant'
                                          }]
                                          }
                            } // setupContext
                        
                        short.load ({ setupContext })
                        short.changeContext ( 'setupContext' )

                        // Setup event execution is on change context:
                        expect ( emit[0] ).to.equal ( 'setup' )
                        
                        const input = document.getElementById ( 'name' )
                        input.focus ()
                        await userEvent.keyboard ( 'hello' )
                        await wait ( 50 )
                        await waitFor ( () => {
                                expect ( emit ).to.includes ( 'action' )
                                expect ( emit ).to.includes ( 'executed' )
                        }, { timeout: 1000, interval: 12 })
        }) // it Extra parameters to plugin options
       
}) // describe