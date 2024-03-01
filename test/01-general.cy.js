
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
                                    
const short = shortcuts ({onShortcut : ( shortcut, {context,note,type}) =>  console.log (shortcut, context, note, type)   });
    
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
        short.changeContext ( )
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
                                         , 'yo' : ({msg}) => result = msg
                                    }}
        short.load ( myAllContext )
        short.changeContext ( 'myAll' )
        short.emit ( 'yo', { context: short.getContext(), note: 'tt', type:'custom', msg:'hello' })
        expect ( result ).to.be.equal ( 'hello' )
        short.changeContext ( 'general' )
        short.unload ( 'myAll' )
        done ()
    }) // it emit custom event



it ( 'List shortcuts', () => {
        let general =  short.listShortcuts ('general');
        expect ( general ).to.be.an('array')
        expect ( general ).to.have.lengthOf ( 1 )
        expect ( general[0] ).to.be.equal ( 'KEY:A+SHIFT' )
        
        let fail = short.listShortcuts ('somethingNotExisting');
        expect ( fail ).to.be.null
    
        let all = short.listShortcuts ();
        expect ( all ).to.be.an('array')
        
        expect ( all ).to.have.lengthOf ( 2 )
        expect ( all[0] ).to.have.property ( 'context' )
        expect ( all[0] ).to.have.property ( 'shortcuts' )
        expect ( all[0].shortcuts ).to.be.an('array')
        expect ( all[0].shortcuts ).to.have.lengthOf ( 1 )
        expect ( all[0].shortcuts[0] ).to.be.equal ( 'KEY:A+SHIFT' )
        expect ( all[0].context ).to.be.equal ( 'general' )
    }) // it list shortcuts



it ( 'Click on anchor', done => {
        // Click on anchor that don't have click-data attribute.
        let result = 'none';
        short.load ({ 'extra' : { 
                                'click: left - 1' : ({target, context, event }) => {
                                            event.preventDefault ()
                                            expect ( context ).to.be.equal ( 'extra' )
                                            expect ( target.nodeName ).to.be.equal ( 'A' )
                                            result = target.nodeName
                                        }
                            } 
                })
        short.changeContext ( 'extra' )    
        cy.get ( '#anchor' ).click ()
        cy.wait ( 3 ) // Consider mouse click has some latency
        // According Cypress documentation: 
        // It is unsafe to chain further commands that rely on the subject after .click(). 
        // source docs: https://docs.cypress.io/api/commands/click
        .then ( () => {
                    short.changeContext ( 'general' )              
                    expect ( result ).to.be.equal ( 'A' )
                    done ()
            })
    }) // it click on anchor
}) // describe


