
import Block from '../test-components/Block.jsx'
import '../test-components/style.css'
import shortcuts from '../src/main.js'
import { expect } from 'chai'

let
       a = false
     , b = false
     ;
const short = shortcuts ({onShortcut : ( shortcut, context, note ) => console.log (shortcut, context, note)});
short.load ({
                  general : {
                            'shift+a': [ () => a = true ]
                        }
                , extra : {    
                            'shift+a,p,r,o,b,a,ctrl+m' : () => b = true 
                        }
        })


describe ( 'Shortcuts', () => {

beforeEach ( () => {
    cy.mount ( Block ()  )
    a = false, b = false
}) // beforeEach



it ( 'Simple shortcut', done => {
            let res = false;
            short.changeContext ( 'general' )
            cy.get('body').type ( '{shift}a' )
            cy.wait ( 100 )   // Default wait sequence timeout is 480 ms
              .then ( () => { 
                                expect ( a ).to.be.true 
                                done ()
                        })            
    }) // it first test



it ( 'Check context switching and shortcut sequences', done => {
    expect ( a ).to.be.false
    expect ( b ).to.be.false
    
    short.changeContext ( 'extra' )
    cy.get('body').type ( '{shift}a' )
    cy.wait ( 500 )   // Default wait sequence timeout is 480 ms. Context 'extra' has a sequence of 7 keys. Need to wait for timeout
      .then ( () => {
                        expect ( a ).to.be.false
                        
                        cy.get('body')
                                .type ( '{shift}a' )
                                .type('proba')
                                .type('{ctrl}M')
                        return cy.wait ( 1 )   // Shortuct sequence is 7 keys - the maximum number of keys for this context. Don't need to wait for timeout
            })
      .then ( () => {
                        expect ( b ).to.be.true

                        short.changeContext ( 'general' )
                        cy.get('body').type ( '{shift}a' )
                        return cy.wait ( 2 )  // Context 'general' has a sequence of 1 key. Don't need to wait for timeout
                })
        .then ( () => {
                        expect ( a ).to.be.true
                        done ()
                })
}) // it context and shortcut sequences



it ( 'Single mouse click', done => {
    expect ( a ).to.be.false
    expect ( b ).to.be.false
    short.load ({ 'extra' : { 
                            'mouse-click-left-1' : () => a = true 
                        } 
            })
    short.changeContext ( 'extra' )
    cy.get('#rspan').click ()
    cy.wait ( 350 ) // Default wait mouse timeout is 320 ms
      .then ( () => {
                        expect ( a ).to.be.true
                        done ()
            })
}) // it mouse click



it ( 'Double mouse click', done => {
    expect ( a ).to.be.false
    expect ( b ).to.be.false
    
    short.changeContext ( 'extra' )
    
    short.load ({   
                    'extra' : {   // load will overwrite existing 'extra' context definition
                                  'mouse-click-left-2' : () => a = true
                              } 
                }) // load will restart the selected context
                   
    cy.get('#rspan').click().click ().click () // Third click is ignored. Max clicks according definition is 2.
    cy.wait ( 350 ) // Default wait mouse timeout is 320 ms
      .then ( () => {
                    expect ( a ).to.be.true
                    done ()
        })
}) // it double mouse click



it ( 'Emit custom event', () => {
      let result = null;
      const myAllContext = { 
                              myAll: {
                                        'mouse-click-leff-1' : () =>  console.log ( 'nothing' )
                                      , 'yo' : r => result = r
                                  }}
      short.load ( myAllContext )
      short.changeContext ( 'myAll' )
      short.emit ( 'yo', 'hello' )
      expect ( result ).to.be.equal ( 'hello' )
}) // it emit custom event

}) // describe