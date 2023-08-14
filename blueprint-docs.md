# Shortcuts (@peter.naydenov/shortcuts)
*UNDER HEAVY DEVELOPMENT - early experimental stage*

Build a keyboard shortcuts maps and describe a mouse clicks. Control them on context.

Tread it as a "**draft**" during `HEAVY DEVELOPMENT` stage. the API will change frequently and version of the package will not be updated. Will stay at `0.0.1` until the API get usable.





Create shortcuts for your web application based on keyboard and mouse events.

Listen for keyboard, mouse and touch events and converts them into event-emmiter events. 
Define a shortcut library with shortcut names and callback functions. The callback functions will be called when the shortcut is pressed. Library `shortcuts` supports a context switching and that allows 
to add, remove and change multiple shortcuts by changing the current context. 

- Context switching;
- Listen for keyboard, mouse and touch events;
- Read a shortcut sequences;
- Multiple mouse clicks events for left and right mouse buttons;
- The delay between keypresses and mouse clicks in shortcut sequences are controlled by parameters;
- Centralized control over mouse click event. All clicks on the page can be described by a single callback function;


Define and conrol shortcuts in your application. Setup a stage, create a shortcut name and associate a list of callback function with it. The callback function will be called when the shortcut is pressed. Changing the stage will stop all shortcuts associated with it old stage and start all shortcuts associated with the new stage.

Event sources: keyboard, mouse, touch;

## Installation

```bash
 npm i @peter.naydenov/shortcuts
```

From the project file:

```js
 import shortcuts from '@peter.naydenov/shortcuts'

```

## Methods


```js
  'load'          : 'Provide context objects, shortcuts related to the context and list of callback functions'
, 'unload'        : 'Remove context objects and shortcuts'
, 'changeContext' : 'Change the current context. Change active list of shortcuts'
, 'pause'         : 'Disable all shortcuts. No change of context'
, 'resume'        : 'Resume shortcuts after pause'
, 'getContext'    : 'Return the current context name'
```


## Keyboard Action functions
Keypress will create an event with name of pressed keys. If `shortcut` has a callback function associated with this name, the callback function will be called. 

The callback function will receive an object with the following properties:

```js
    function keyCallback (key) {
        console.log(key)
    }
```
Every shortcut is defined by a callback function. The callback function will be called when the shortcut is pressed. The callback function will receive an object with the following properties:


```js
    function keyCallback (key) {
        console.log(key)
    }
```