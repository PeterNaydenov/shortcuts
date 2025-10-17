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


                                    
let short;



describe ( "Shortcuts", () => {

        beforeEach ( async  () => {
                        short = shortcuts ()
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
                      expect ( general ).to.have.lengthOf ( 1 )
                      expect ( general[0] ).to.be.equal ( 'KEY:A+SHIFT' )
                      
                      let fail = short.listShortcuts ( 'somethingNotExisting' );
                      expect ( fail ).to.be.null
                  
                      let all = short.listShortcuts ();
                      expect ( all ).to.be.an ( 'array' )
                   
                      expect ( all ).to.have.lengthOf ( 4 )
                      // Property 'context' is a context name - string
                      expect ( all[0] ).to.have.property ( 'context' )
                      expect ( all[0] ).to.have.property ( 'shortcuts' )
                      expect ( all[0].shortcuts ).to.be.an ( 'array' )
                      expect ( all[0].shortcuts ).to.have.lengthOf ( 1 )
                      expect ( all[0].shortcuts[0] ).to.be.equal ( 'KEY:A+SHIFT' )
                      expect ( all[0].context ).to.be.equal ( 'general' )
            }) // it list shortcuts



        it.only ( 'Reset', () => {
                      short.reset ()
                      expect ( short.listShortcuts () ).to.have.lengthOf ( 0 )
                      expect ( short.listShortcuts () ).to.have.lengthOf ( 0 )
                      expect ( short.getContext () ).to.be.null
                      short.setDependencies ({ a:'alabala' })
                      // expect ( short.getDependencies ).to.be.empty
                      // expect ( short ).to.be.null
            }) // it Reset
        

}) // describe

