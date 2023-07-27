# Shortcuts (@peter.naydenov/shortcuts)
*UNDER HEAVY DEVELOPMENT - early experimental stage*

Build a keyboard shortcuts maps and describe a mouse clicks. Control them on context.

Tread it as a "**draft**" during `HEAVY DEVELOPMENT` stage. the API will change frequently and version of the package will not be updated. Will stay at `0.0.1` until the API get usable.





## General Description Rules
The shortcuts definition includes a context name and a set of rules(object). The rules are a set of key-value pairs. The key is a shortcut name and the value is a function to be executed when the shortcut is triggered (action function).

```js
// Shortcut definition object:
{
    contextName : {
                    shortcutName : function () {
                                        // do something
                                    }
                }
}
```
Load a shortcut definition by calling `load` method.

```js
include shortcuts from '@peter.naydenov/shortcuts'
const short = shortcuts ();
short.load ( shortcutDefinition )
```

Shortcuts are working only if contex is active. To activate a context call `changeContext` method.

```js
short.changeContext ( contextName )
```

To deactivate a context without starting other context, call `changeContext` method without arguments.

```js
short.changeContext ()
``` 

Shortcuts context has `note` that works like sub-contexts. Every shortcut function receives a context and note as arguments, so you can have fine control over the context.

The idea of `note` is to minimize the number of contexts if they are very simular. You can use same context but stop some of the shortcuts by setting a different `note`.

```js
short.setNote ( 'special' ) // set note to 'special'
short.setNote () // remove note
```

```js
{
    contextName : {
                    shortcutName : function ( {context, note} ) {
                                        if ( note === 'special' ) {
                                                        // do something
                                            }
                                    }
                }
}
```

Check current context by calling `getContext` method.

```js
short.getContext ()
```

Check notes by calling `getNote` method.

```js
short.getNote ()
```





## Mouse Event Descriptions
Mouse event name is build from the following parts:
```js
 // mouse-click-<mouse button>-<number of clicks>
 // example:
 // mouse-click-left-2 -> for double click with left mouse button
 // mouse-click-right-3 -> for triple click with right mouse button
```

The modifier keys `ctrl`, `alt`, and `shift` are supported. They are added to the mouse event by sign `+`:

```js
 // example:
 // ctrl+mouse-click-left-1 -> for single click with left mouse button and ctrl key pressed
```
Order of describing mouse event and modifier keys is not important.

```js
 // example:
 // mouse-click-left-1+ctrl -> same as above

 // These 3 descriptions are equal:
 // mouse-click-left-1+ctrl+alt+shift
 // alt+shift+mouse-click-left-1+ctrl
 // mouse-click-left-1+shift+ctrl+alt
```




## Keyboard Event Descriptions







## Action Functions
Action functions are called when a shortcut is triggered. They are a bit different for keyboard and mouse shortcuts.

### Keyboard Action Functions

### Mouse Action Functions
Mouse action functions can be described like:
```js
function myClickHandler ( event ) {
    // do something
}
```




## Options