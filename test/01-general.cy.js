
import Block from '../test-components/Block.jsx'
import '../test-components/style.css'
import shortcuts from '../src/main.js'
import { expect } from 'chai'

let
       a = false
     , b = false
     ;
const short = shortcuts ();
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
            cy.wait ( 500 )   // Default wait sequence timeout is 480 ms
              .then ( () => { 
                                expect ( a ).to.be.true 
                                done ()
                        })            
    }) // it first test



it ( 'Check context switching and shortcut sequences', done => {
    expect ( a ).to.be.false
    expect ( b ).to.be.false
    console.log ( `CONTEXT:  -----> ${short.getContext ()}` )
    short.changeContext ( 'extra' )
    cy.get('body').type ( '{shift}a' )
    cy.wait ( 500 )   // Default wait sequence timeout is 480 ms
      .then ( () => {
                        expect ( a ).to.be.false
                        cy.get('body')
                                .type ( '{shift}a' )
                                .type('proba')
                                .type('{ctrl}M')
                        return cy.wait ( 500 )
            })
        .then ( () => {
                        expect ( b ).to.be.true
                        short.changeContext ( 'general' )
                        cy.get('body').type ( '{shift}a' )
                        return cy.wait ( 500 )
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
    short.load ({ 'extra' : { 
                                'mouse-click-left-2' : () => a = true
                            } 
                }) // load will restart the selected context
    cy.get('#rspan').dblclick ()
    cy.wait ( 350 ) // Default wait mouse timeout is 320 ms
      .then ( () => {
                    expect ( a ).to.be.true
                    done ()
        })
}) // it double mouse click

}) // describe