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

```js
short.setNote ( 'special' ) // set note to 'special'
short.setNote () // remove note
```

The idea of `note` is to minimize the number of contexts if they are very simular. You can use same context but change the `note` and control the shortcut execution from inside of the action function by checking the `note`.

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

Context and notes are available inside action functions but you can check them from outside too.
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

Multiple clicks are detected automatically by time interval between clicks. The default interval is 320ms but you can change it by setting `mouseWait` option. Read more in section `Options`.





## Keyboard Event Descriptions
Keyboard event description contains a key name and a modifier keys if they are used. The modifier keys `ctrl`, `alt`, and `shift` are supported. They are added to the keyboard event by sign `+`:

```js
 // example:
 // ctrl+alt+shift+key-a -> for key 'a' with ctrl, alt and shift keys pressed
```

Keyboard event description support a shortcut sequenses. These means that you can press a sequence of keys to trigger a shortcut. The sequence elements are separated by sign `,`:

```js
 // example:
 // a,b,c -> for key 'a' then key 'b' then key 'c'

 // g+shift,o,t,o -> for key 'g' with shift, then key 'o', then key 't' then key 'o'
```

Order of describing keyboard event and modifier keys is not important, but sequence elements are:

```js
 // example:
 // a+ctrl,l,o,t -> a with ctrl, then l, then o, then t
 // this is equal to:
 // ctrl+a,l,o,t
 // but not equal to:
 // ctrl+a,o,t,l
```

Keyboard sequence is detected automatically by time interval between key presses. The default interval is 480ms but you can change it by setting `keyWait` option. Read more in section `Options`. 

There is a way to disable automatic sequence detection and mark the begining and the end of the sequense by using a keyboard action functions. Read more in section `Keyboard Action Functions`.

Special characters that are available for your shortcut descriptions:
- 'left' - left arrow key
- 'right' - right arrow key
- 'up' - up arrow key
- 'down' - down arrow key
- 'enter' - enter key
- 'space' - space key
- 'esc' - escape key
- 'tab' - tab key
- 'backspace' - backspace key
- '=' - equal key
- F1 - F12 - function keys
- '/' - slash key
- '\\' - backslash key
- '[' - open square bracket key
- ']' - close square bracket key
- '`' - backtick key

**Warning**: For keys with two symbols, in shortcut description use the lower one. Examples: Use '=' instead of '+', use '/' instead of '?', etc. Modifier keys are available for special characters too.

**Warining**: Some of the shortcuts are used by OS and the browswer, so they are not available.



## Action Functions
Action functions are called when a shortcut is triggered. They is a difference between keyboard and mouse action functions. Arguments are slightly different.

### Keyboard Action Functions





### Mouse Action Functions
Mouse action functions can be described like:

```js
function myClickHandler ( event ) {
    // do something
}
```




## Options