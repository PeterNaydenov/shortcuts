import { beforeEach, describe, it, expect } from 'vitest'
import { userEvent, page } from '@vitest/browser/context'
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



describe.skip ( "Shortcuts", () => {

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
                    short.destroy ()
                    a = false, b = false, c = null;
            }) // afterEach


        
        it ( 'Emit custom event', () => {
                const res = new Promise ( async (resolve) => {
                                        let result = null;
                                        short.changeContext ()
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
                                        resolve ( 'success' )
                                })
                return res
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
                
                expect ( all ).to.have.lengthOf ( 3 )
                expect ( all[0] ).to.have.property ( 'context' )
                expect ( all[0] ).to.have.property ( 'shortcuts' )
                expect ( all[0].shortcuts ).to.be.an('array')
                expect ( all[0].shortcuts ).to.have.lengthOf ( 1 )
                expect ( all[0].shortcuts[0] ).to.be.equal ( 'KEY:A+SHIFT' )
                expect ( all[0].context ).to.be.equal ( 'general' )
            }) // it list shortcuts



        it ( 'Click on anchor', () => {
                const res = new Promise ( async (resolve) => {
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
                                        wait ( 10 )
                                            .then ( async () => {
                                                    let loc = document.querySelector ( '#anchor' )  || false;
                                                    if ( loc )   await userEvent.click ( loc )
                                                    expect ( result ).to.be.equal ( 'A' )  
                                                    short.changeContext ( 'general' )
                                                    resolve ( 'success' )
                                                })
                                })
                return res
            }) // it click on anchor

}) // describe

