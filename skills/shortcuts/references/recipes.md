# Recipes

## Contents
- [One context per route](#one-context-per-route)
- [Modal on top of a page](#modal-on-top-of-a-page)
- [Same keys, different behavior with notes](#same-keys-different-behavior-with-notes)
- [Vim-like "go to line" with wait()](#vim-like-go-to-line-with-wait)
- [Several gestures, one handler](#several-gestures-one-handler)
- [Testing actions](#testing-actions)

## One context per route

Name contexts after routes and switch in the router hook. Shared shortcuts can be spread into each context.

```js
const common = {
      'key: ctrl+k' : ({ dependencies }) => dependencies.ui.openSearch ()
    , 'key: g,h'    : ({ dependencies }) => dependencies.router.go ( '/' )
}

short.load ({
      home     : { ...common }
    , settings : { ...common, 'key: ctrl+s': ({ dependencies }) => dependencies.settings.save () }
})
short.setDependencies ({ router, ui, settings })
router.afterEach ( route => short.changeContext ( route.name ))
```

## Modal on top of a page

Only one context is active, so a modal gets its own context and the page context is restored on close.

```js
function openModal () {
        previous = short.getContext ()
        short.changeContext ( 'modal' )
}
function closeModal () {
        short.changeContext ( previous )
}

short.load ({
    modal : {
          'key: esc'      : () => closeModal ()
        , 'key: enter'    : ({ dependencies }) => dependencies.modal.confirm ()
        , 'click: left-1' : ({ target }) => target.dataset.click === 'close' && closeModal ()
    }
})
```

For nested modals keep a stack of context names instead of a single `previous`.

## Same keys, different behavior with notes

Notes avoid duplicating a context when only a sub-state changes.

```js
short.load ({
    editor : {
        'key: ctrl+s' : ({ note, dependencies }) => note === 'draft'
                                                        ? dependencies.api.saveDraft ()
                                                        : dependencies.api.publish ()
    }
})
short.changeContext ( 'editor' )
short.setNote ( 'draft' )
```

## Vim-like "go to line" with wait()

`wait()` stops sequence detection so each following key fires on its own; `end()` restores it.

```js
let digits = ''
short.load ({
    editor : {
          'key: g'     : ({ wait }) => { digits = ''; wait () }
        , 'key: 1'     : ({ isWaiting }) => { if ( isWaiting () ) digits += '1' }
        // ...same for 0-9
        , 'key: enter' : ({ isWaiting, end, dependencies }) => {
                                if ( !isWaiting () )   return
                                end ()
                                dependencies.editor.goToLine ( Number ( digits ))
                        }
    }
})
```

## Several gestures, one handler

Emit one custom event from different gestures and implement it once.

```js
short.load ({
    gallery : {
          'key: right'     : ({ dependencies }) => dependencies.emit ( '@next' )
        , 'scroll: down'   : ({ dependencies }) => dependencies.emit ( '@next' )
        , 'click: left-1'  : ({ target, dependencies }) => target.dataset.click === 'next' && dependencies.emit ( '@next' )
        , '@next'          : () => gallery.next ()
    }
})
// From anywhere else in the app:
short.emit ( '@next' )
```

## Testing actions

Actions are plain functions of `data`, so definitions can be tested without DOM events by emitting the shortcut:

```js
const calls = []
short.setDependencies ({ api: { save: () => calls.push ( 'save' ) } })
short.load ({ editor: { 'key: ctrl+s': ({ dependencies }) => dependencies.api.save () } })
short.enablePlugin ( pluginKey )
short.changeContext ( 'editor' )
short.emit ( 'key: ctrl+s' )
// calls → [ 'save' ]
```

`emit` passes `{ dependencies, type: 'custom' }` instead of full plugin data. Actions that read plugin-only fields (`target`, `wait`, ...) need those passed explicitly or a real DOM event in the test.
