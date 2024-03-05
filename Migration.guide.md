# Migration Guides


## From version 2.x.x to version 3.x.x

Reason for significant refactoring of the code was my desire to make the library extensible with a plugins. Plugins role is to convert DOM events to shortcut strings, then the core part will trigger the action functions related to the shortcut. Now we have a core, plugin interface and plugins. All listener for `keyboard` and `mouse clicks` are moved to plugins. Mouse events are tracked by `click` plugin and keyboard events are tracked by `key` plugin. 

We starting with only two plugins that cover the existing functionality of the library but plans are to extend the library with more plugins. For example we can add `'scroll`, `drag-drop`, `input events`, etc. Whould be great to make possible to describe all possible page events as shortcuts.

### Package structure
Package contains the library and these two plugins.

```js
// Import the library and plugins
// Version 2.x.x
import shortcuts  from 'shortcuts';
const short2 =  shortcuts({listenFor: ['mouse', 'keyboard']}) // Start listening for mouse and keyboard events
// Version 3.x.x
// Package provides access to the library and plugins. No default import anymore.
import { shortcuts, click, key } from 'shortcuts';
const short3 = shortcuts () // Start library without any plugins
// Enable plugins if you need them:
shorts3.enablePlugin(click)
shorts3.enablePlugin(key)
```

### Global Options
Part of the options are moved to the plugin options. 
```js
// Version 2 options:
  mouseWait     : '-> Moved to click plugin options'
, keyWait       : '-> Moved to key plugin options'
, clickTarget   : '-> Moved to click plugin options'
, listenFor     : `x  Removed. Use enablePlugin() method to start listening for a plugin`
, onShortcut    : 'No changes. Available as global option'
, streamKeys    : '-> Moved to key plugin options'
```
The method `shortcuts.getDefaults()` was removed. No reasons to exist anymore.

### Shortcut names
Because we have plugins now, we need to address somehow the plugin that will take care about the shortcut. Introducing plugin prefix.
```js
// Description of the shortcut
// Version 2.x.x
const description2 = {
    contextName : {
                        'shortcutName' : 'actionFunction'
                    }
        }
// Version 3.x.x    
const description3 ={
    contextName : {
                        'pluginPrefix:shortcutName' : 'actionFunction'
                    }
        }

// Here is an example:
//v.2.x.x
const desc2 = {
    myContext : {
                    'shift+f' : r => console.log(r)
                }
        }
//v.3.x.x
const desc3 = {
    myContext : {
                    'key:shift+f' : r => console.log(r)
                }
        }
```


### Mouse events
Prevent default is not called by default anymore. Handle it manually in the action function if needed. Object `event` is available in arguments object of action function. That will allow you to use default browser behavior without writing additional code.





## From version 1.x.x to version 2.x.x
There are 2 breaking changes: in action functions and in emit method.
### Action functions
Version 1.x.x:
```js
function ( shortcut, contextName, contextNote ) {
    // ...
}
```
In version 2.x.x:
```js
function ({ shortcut, context, note, dependencies } ) {
    // Change:
    // - all arguments are named(properties of single object);
    // - argument order doesn't matter;
    // - added argument `dependencies` to pass dependencies to all action function;
}
```

### Emit method

Version 1.x.x:
```js
let result = null;
const myAllContext = { 
                              myAll: {
                                       'yo' : r => result = r
                                  }}
short.load ( myAllContext )
short.changeContext ( 'myAll' )
short.emit ( 'yo', 'hello' )
// result == 'hello'
```

In version 2.x.x:
```js
let result = null;
const myAllContext = { 
                              myAll: {
                                       'yo' : ( dependencies, r ) => result = r
                                       // Change:
                                       // - first argument is always dependencies object;
                                       // - event-data is available from position 2 of arguments list;
                                  }}
short.load ( myAllContext )
short.changeContext ( 'myAll' )
short.emit ( 'yo', 'hello' ) 
// result == 'hello'
```