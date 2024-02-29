
import Block from '../test-components/Block.jsx'
import '../test-components/style.css'
import { 
          pluginClick,
          pluginKey
        , shortcuts 
                } from '../src/main.js'
import { expect } from 'chai'

import askForPromise from 'ask-for-promise'

let
       a = false
     , b = false
     ;
const short = shortcuts ({onShortcut : (shortcut, {context, note,type }) => console.log (shortcut, context, note, type)});
short.load ({
                  general : {
                            ' key : shift+a': [ () => a = true ]
                        }
                , extra : {    
                            'key:shift+a,p,r,o,b,a,ctrl+m' : () => b = true 
                        }
        })



describe ( 'Shortcuts', () => {

beforeEach ( () => {
    cy.mount ( Block ()  )
    a = false, b = false
}) // beforeEach



it ( 'Shortcut if no plugin installed', done => {
            short.changeContext ( 'general' )
            let r = short.listShortcuts ('general')
            expect ( r[0]).to.equal ( ' key : shift+a' ) // Shortcut name is the same as it was set
            done ()
    }) // it no plugin installed



it ( 'Key plugin, no context selected', done => {
            short.enablePlugin ( pluginKey )
            const r = short.listShortcuts ( 'general' )
            expect ( r[0] ).to.equal ( 'KEY:A+SHIFT' ) // Shortcut name is recognized by plugin and is normalized
            done ()
    }) // it key plugin installed, no context selected



it ( 'Key plugin with context selected', done => {
            short.enablePlugin ( pluginKey )
            short.changeContext ( 'general' )
            const r = short.listShortcuts ('general')
            expect ( r[0] ).to.equal ( 'KEY:A+SHIFT' ) // Shortcut name is recognized by plugin and is normalized
            cy.wait ( 1 )
                .then ( () => done () )
    }) // it key plugin installed with context selected



it ( 'Simple shortcut', done => {
        short.enablePlugin  ( pluginKey  )
        short.changeContext ( 'general'  )
        cy.get('body').type ( '{shift}a' )
        cy.wait ( 1 )   // Default wait sequence timeout is 480 ms, but maxSequence is 1, so we don't need to wait for timeout
          .then ( () => { 
                            expect ( a ).to.be.true 
                            done ()
                    })
    }) // it simple shortcut



it ( 'Call sequence shortcut', done => {
        b = false
        short.enablePlugin ( pluginKey )
        short.changeContext ( 'general' )
        short.changeContext ( 'extra' )
        
        cy.get('body')
          .type ( '{shift}a' )
          .type ( 'proba' )
          .type ( '{ctrl}M' )
       
        cy.wait ( 1 )   // Default wait sequence timeout is 480 ms, but maxSequence is 1, so we don't need to wait for timeout
          .then ( () => { 
                            expect ( b ).to.be.true
                            done ()
                    })                      
    }) // it call sequence shortcut



it ( 'Single mouse click', done => {
        expect ( a ).to.be.false
        expect ( b ).to.be.false
        short.enablePlugin ( pluginClick )
        
        short.load ({ 'extra' : { 
                                ' cLIck  : left - 1 ' : () => a = true   // Check if spaces, letter case can break the shortcut recognition
                            }
                })
        short.changeContext ( 'extra' )
        cy.get('#rspan').click ()
        cy.wait ( 10 ) // Default wait mouse timeout is 320 ms, but maxClicks is 1, so we don't need to wait for timeout
          .then ( () => {
                expect ( a ).to.be.true 
            })
        cy.wait ( 1 ) // ...but mouseIgnore still active, so we better wait to not interfere with next test
          .then ( () => done() )
    }) // it mouse click



it ( 'Double mouse click', done => {
        expect ( a ).to.be.false
        expect ( b ).to.be.false

        short.enablePlugin ( pluginClick )
        short.changeContext ( 'extra' )
        
        short.load ({   
                        'extra' : {   // load will overwrite existing 'extra' context definition
                                      'click: left-2' : () => a = true
                                  } 
                    }) // load will restart the selected context
                       
        cy.get('#rspan').click().click ().click () // Third click is ignored. Max clicks according definition is 2.
        cy.wait ( 1 ) // Default wait mouse timeout is 320 ms
          .then ( () => {
                        expect ( a ).to.be.true
                        done ()
            })
    }) // it double mouse click



it ( 'Dependencies on shortcuts', done => {
        const task = askForPromise ();
        expect ( a ).to.be.false
        expect ( b ).to.be.false

        short.enablePlugin ( pluginClick )
        short.setDependencies ({ task })
        
        short.load ({   
                        'extra' : {   // load will overwrite existing 'extra' context definition
                                    'click: left-1' : ({dependencies}) => {
                                        console.log ( dependencies )
                                                                        const { task } = dependencies;
                                                                        expect ( task ).to.have.property ( 'done' )
                                                                        expect ( task ).to.have.property ( 'promise' )
                                                                        a = true
                                                                    }
                                } 
                    }) // load will restart the selected context

        short.changeContext ( 'extra' )
        cy.get('#rspan').click ()
        cy.wait ( 350 ) // Default wait mouse timeout is 320 ms
        .then ( () => {
                        expect ( a ).to.be.true
                        done ()
            })
    }) // it dependencies on shortcuts



it ( 'Emit custom event', done => {
        let result = null;
        short.changeContext ()
        short.enablePlugin ( pluginClick )
        const myAllContext = { 
                                myAll: {
                                          'click : leff-1' : () =>  console.log ( 'nothing' )
                                         , 'yo' : ( dependencies, r ) =>  result = r
                                    }}
        short.load ( myAllContext )
        short.changeContext ( 'myAll' )
        short.emit ( 'yo', 'hello' )
        expect ( result ).to.be.equal ( 'hello' )
        short.changeContext ( 'general' )
        short.unload ( 'myAll' )
        done ()
    }) // it emit custom event


}) // describe


