# Shortcuts (@peter.naydenov/shortcuts)

![version](https://img.shields.io/github/package-json/v/peterNaydenov/shortcuts)
![license](https://img.shields.io/github/license/peterNaydenov/shortcuts)



Define a context based keyboard-shortcuts and describe a mouse clicks. Switch among contexts.




## What's new?

- Version 1.1.x and above are coming with method `emit` that make possible to trigger shortcuts programmatically. In `shortcuts` you can mix keyboard, mouse and programmatical events that is prity everything that can happen in a web page;
- Method `setDependencies` comes after version 2.0.0. You can insert external libraries and modules that you will need to access from action functions. They will come as **dependencies** object. In function `emit` will come as first argument. Other arguments are attached behind the dependencies object;
- Another html data attribute is added - `data-quick-click`. Example: `<button data-click="id" data-quick-click>Click me</button>`. This attribute is saying to `shortcuts` that target element don't need to wait for more then 1 click and shortcut can be executed immediately after the click. Attribute is available in version 2.0.0 and above;
- Method `listShortcuts` is added in version 2.0.0. It returns a list of shortcuts for requested context. If context is not set, will return a list of all shortcuts;


## Shortcut Description Rules
The shortcuts definition includes a context name and a set of rules(object). The rules are a set of key-value pairs. The key is a shortcut name and the value is a function or array of functions, to be executed when the shortcut is triggered (action function).

```js
// { context: { shortcutName: actionFunction } }
// or
// { context: { shortcutName: [ actionFunction1, actionFunction2 ] }}

// Shortcut definition object:
{
    contextName : {
                    shortcutName : function () {
                                                // do something
                                        }
                    , shortcutName : [ 
                                              function action1() {
                                                        // do something
                                                }
                                            , function action2() {
                                                        // do something
                                                }
                                    ]
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
short.setNote () // remove the note
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

 // mouse button options: left, right, middle
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


## Define a mouse targets
Target HTML elements for `shortcuts` are defined by `data-click` attribute. The value of the attribute is the name of the target. Example:

```html
<button data-click="id">Click me</button>
<!-- target name is 'id' -->
```

Attribute is customizable by setting `clickTarget` option. Read more in section `Options`.

If current shortcuts context contain definition for 2 or more clicks, this may slow down the execution of single shortcuts because `shortcuts` will wait for the time interval to detect multiple clicks. To avoid this for specific targets, you can set `data-quick-click` attribute to the target element. Example:

```html
<button data-click="id" data-quick-click>Click me</button>
<!-- target name is 'id' and will not wait for more then 1 click -->
```
Using a <a> tag is a special case. It's always recognized as a target, and always with attribute `data-quick-click`. No need to set it manually. Example:

```html
<a href="#">Click me</a>
<!-- Recognized as a target and will not wait for more then 1 click -->
<!-- Take care for the action from shortcut `mouse-click-left-1`. -->
```

Clicking on <a> tag will not execute anything. All events are blocked by default. In your `mouse-click-left-1` action function you can write:

```js
{
    contextName : {
                    'mouse-click-left-1' : function ( {target, event} ) {
                                        if ( target.tagName === 'A' ) { // All targets that are <a> tags will execute the default action
                                                  window.location.href = target.href
                                            }
                                    }
                }
}
```



## Keyboard Event Descriptions
Keyboard event description contains a key name and a modifier keys if they are used. The modifier keys `ctrl`, `alt`, and `shift` are supported. They are added to the keyboard event by sign `+`:

```js
 // example:
 // ctrl+alt+shift+a -> for key 'a' with ctrl, alt and shift keys pressed
```

Keyboard event description support a shortcut sequenses. These means that you can press a sequence of keys to trigger a shortcut. The sequence elements are separated by sign "," ( coma ):

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
Description of keyboard action functions is:
```js
function myKeyHandler ({
                  context   // (string) Name of the current context;
                , note      // (string) Name of the note or null if note isn't set;
                , dependencies // (object) Object with dependencies that you have set by calling `setDependencies` method;
                , wait      // (function). Call it to stop a sequence timer and write shortcut sequence without a timer.
                , end       // (function). Recover the sequence timer;
                , ignore    // (function). Call it to ignore the current shortcut from the sequence;
                , isWaiting // (boolean). True if the sequence timer is active;
                        }) {
    // Body of the handler. Do something...
}
```




### Mouse Action Functions
Mouse action functions can be described like:

```js
function myMouseHandler ({
                  context     // (string) Name of the current context;
                , note        // (string) Name of the note or null if note isn't set;
                , dependencies // (object) Object with dependencies that you have set by calling `setDependencies` method;
                , target      // (DOM element). Target element of the mouse event;
                , targetProps // (object). Coordinates of the target element (top, left, right, bottom, width, height) or null if target element is not available;
                , x           // (number). X coordinate of the target element;
                , y           // (number). Y coordinate of the target element;
                , event       // (object). Original mouse event object;
          }) {
    // Body of the handler. Do something...
}
```





## Methods

Description of the methods of shortcut instance:

```js
  load          : 'Load and extend a shortcut definition.'
, unload        : 'Remove a shortcut context with all its shortcuts.'
, changeContext : 'Switch to existing shortcut context.'
, emit          : 'Trigger a shortcut or custom event programmatically.'
, pause         : 'Stop listening for shortcuts.'
, resume        : 'Resume listening for shortcuts.'
, listContexts  : 'Return list of available contexts.'
, getContext    : 'Return a name of current context or null if there is no context selected'
, getNote       : `Return a name of current note or null if note isn't set`
, setNote       : 'Set a note to current context.'
```

### How to 'pause' and 'resume'?
When you want to stop execution of shortcuts, call `short.pause()`. It's equal to `short.pause('*')`. Will stop all shortcuts in the active context. Stop for single shortcut is by calling `short.pause('shortcutName')`. To resume shortcuts execution call `short.resume()`. It's equal to `short.resume('*')`. Will resume all shortcuts in the active context. Resume for single shortcut is by calling `short.resume('shortcutName')`.

```js
// pause all shortcuts in the active context
short.pause () // will stop all shortcuts in the active context
short.resume ( 'shift+a' ) // will resume only 'shift+a' shortcut

short.resume ('*') // will resume all shortcuts
```



## Options

By `options` you can customize the behavior of the shortcuts. Here is the list of available options:

```js
  mouseWait     : 'Timeout for entering multiple mouse events. Default value - 320.'
, keyWait       : 'Timeout for entering shortcut sequence in ms. Default value - 480'
, clickTarget   : 'Data attribute name to recognize click items in HTML. Default value - click' // data attribute 'click' means attribute ( data-click='someName' )
, listenFor     : `List input signal sources. Default value - [ 'mouse', 'keyboard' ]`
, onShortcut    : 'False or a callback function that is called when a shortcut is triggered. Default value - false'
, streamKeys    : 'False or a callback function that is called when a key is pressed. Default value - false'
```

You can request default list of options with their default values:

```js
shortcuts.getDefaults ()
// Note: This method is availalble on the original shortcuts object, not on the shortcuts instance.

// start a shortcuts with default options
const short = shortcuts ()
const short = shortcuts ( shortcuts.getDefaults () ) // same as above
// The idea behind getDefaults is to see what options are available and what are their default values.
```



### onShortcut option
```js
 function onShortcut ({ shortcut, context, note, dependencies }) {
        // shortcut - (string) Triggered shortcut name
        // context - (string) Name of the current context
        // note - (string) Name of the note or null if note isn't set
        // dependencies - (object) Object with dependencies that you have set by calling `setDependencies` method
    }
```



### streamKeys option
```js
 function streamKeys ({ key, context, note, dependencies }) {
        // key - (string) Pressed key name
        // context - (string) Name of the current context
        // note - (string) Name of the note or null if note isn't set
        // dependencies - (object) Object with dependencies that you have set by calling `setDependencies` method
    }
```




## Credits
'@peter.naydenov/shortcuts' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/shortcuts' is released under the MIT License.