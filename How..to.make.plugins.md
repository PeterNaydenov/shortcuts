# Shortcut plugins

Shortcut plugin should be a function that receives 3 arguments: dependencies, state and options. Shoud return an shortcut plugin API object.

```js
function plugin ( dependencies, state, options ) {
  // Normalize all shortcuts related to this plugin
  // Setup some internal state
  // Start listening to DOM events if current context has shortcuts related to this plugin
  // ...
  return {
        // API
          getPrefix: function () {
                            // return a plugin prefix
                        },
          shortcutName : function ( shortcutName ) {
                            // normalize shortcut name
                            // return normalized shortcut name
                        },
            contextChange: function ( context ) {
                            // How plugin should react to context change
                            // return void
                        },
            mute: function () {
                            // Function that will stop DOM events from being triggered
                        },
            unmute: function () {
                            // Function that will resume DOM events
                        },
            destroy: function () {
                            // Destroy plugin instance
                        }
        }
} // plugin
```

State and dependencies are objects coming from the main library. **Dependencies** contains the library event emitter ( dependencies.ev). From state object you have access to the current context object state and loaded shortcuts contextes. Object **options** contains a plugin options provided by the user.

If you need see an example of a shortcut plugin, check the available plugins in the library: key and click.


