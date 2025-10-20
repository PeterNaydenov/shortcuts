import { beforeEach, afterEach, describe, it, test, expect } from 'vitest'
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

let short = shortcuts ();



describe.only ( 'Form plugin', () => {

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
                  let input = document.getElementById ( 'name' )
                  input.focus ()
                  await userEvent.keyboard ( 'hello' )
                  await wait ( 50 )
                  await waitFor ( () => {
                              expect ( edit ).to.equal ( 'changed' )
                      }, { timeout: 1000, interval: 12 })
          }) // it Simpler form listener



      
}) // describe