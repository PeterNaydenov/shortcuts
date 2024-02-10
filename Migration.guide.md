# Migration Guides


## From version 2.x.x to version 3.x.x

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