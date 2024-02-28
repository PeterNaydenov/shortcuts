
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
                            'key:shift+a': [ () => a = true ]
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
            expect ( r[0]).to.equal ( 'key:shift+a' ) // Shortcut name is the same as it was set
            done ()
    }) // it no plugin installed



it ( 'Key plugin, no context selected', done => {
            short.enable ( pluginKey )
            const r = short.listShortcuts ('general')
            expect ( r[0] ).to.equal ( 'KEY:A+SHIFT' ) // Shortcut name is recognized by plugin and is normalized
            done ()
    }) // it key plugin installed, no context selected



it ( 'Key plugin with context selected', done => {
            short.enable ( pluginKey )
            short.changeContext ( 'general' )
            const r = short.listShortcuts ('general')
            expect ( r[0] ).to.equal ( 'KEY:A+SHIFT' ) // Shortcut name is recognized by plugin and is normalized
            done ()
    }) // it key plugin installed with context selected



it ( 'Simple shortcut', done => {
        let res = false;
        short.enable ( pluginKey )
        short.changeContext ( 'general' )
        cy.get('body').type ( '{shift}a' )

        cy.wait ( 1 )   // Default wait sequence timeout is 480 ms, but maxSequence is 1, so we don't need to wait for timeout
          .then ( () => { 
                            expect ( a ).to.be.true 
                            done ()
                    })            
    }) // it simple shortcut



it ( 'Call sequence shortcut', done => {
        b = false
        short.enable ( pluginKey )
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



it.only ( 'Single mouse click', done => {
        expect ( a ).to.be.false
        expect ( b ).to.be.false
        short.enable ( pluginClick )
        
        short.load ({ 'extra' : { 
                                'click:left-1' : () => a = true 
                            } 
                })
        short.changeContext ( 'extra' )
        cy.get('#rspan').click ()
        cy.wait ( 10 ) // Default wait mouse timeout is 320 ms, but maxClicks is 1, so we don't need to wait for timeout
          .then ( () => {
                expect ( a ).to.be.true 
                done ()
            })
        // cy.wait ( 300 ) // ...but mouseIgnore still active, so we better wait to not interfere with next test
        //   .then ( () => done() )
    }) // it mouse click

}) // describe


