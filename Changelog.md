## Release History



### 3.1.4 ( 2025-05-3)
- [x] Dependency update. @peter.naydenov/notice - v.2.4.1


### 3.1.3 ( 2025-01-12)
- [x] Dependency update. @peter.naydenov/notice - v.2.4.0



### 3.1.2 ( 2024-12-23 )
- [x] Dependency update. @peter.naydenov/notice - v.2.3.2



### 3.1.1 ( 2024-03-15 )
- [x] Update: Using @peter.naydenov/notice v.2.3.1: Fix: Callback stop will stop the wildcard callbacks as well;



### 3.1.0 ( 2024-03-14 )
- [x] Using @peter.naydenov/notice v.2.3.0: If action function returns a string 'stop' and execution of followed action functions will be stopped. Option to build a chain of conditional action functions before the main action function;



### 3.0.1 ( 2024-03-06 )
- [x] Fix: Library works again;



### 3.0.0 ( 2024-03-05 )
- [x] Mouse events don't have `preventDefault` by default anymore. Handle it in the action function if needed. Take a look on `Mouse Action Function` argument description. Object `event` is available;
- [x] Plugin system where plugins role is to convert DOM events to shortcut strings, then the core part will trigger the action functions related to the shortcut.
- [x] Plugin can be enable/disable;
- [x] Plugin can be mute/unmute;
- [x] Plugin prefix in shortcut description is required. Keyboard plugin will take care for events started with ‘key:’ for example. Required because we should know the plugin that will handle the event;
- [x] Start a plugin: enablePlugin ( pluginCode, pluginOptions );
- [x] Function to destroy(remove) a plugin - disablePlugin();
- [x] Mute/unmute a plugin. It’s like disable all events for a specific plugin;
- [x] Plugin system documentation;
- [x] Plugin interface: getPrefix, shortcutName, contextChange, mute, unmute, destroy;
- [x] Plugin options - specific for each plugin;
- [ ] Bug: Can't start the library




### 2.2.0 ( 2024-02-10 )
- [x] Folder 'dist' was added to the project. Includes commonjs, umd and esm versions of the library;
- [x] Package.json: "exports" section was added. Allows you to use package as commonjs or es6 module without additional configuration;
- [x] Rollup was added to the project. Used to build the library versions;



### 2.1.0 ( 2023-10-17 )
- [x] Method `setDependencies` to add more external objects available in all action functions;
- [x] Method `getDependencies` to look at existing `dependencies` list;



### 2.0.0 ( 2023-10-16 )
- [x] HTML attribute `data-quick-click` is available to speed up single click response;
- [x] Documentation on methods `pause` and `resume`;
- [x] Method `listShortcuts` to get names of all shortcuts defined;
- [x] Arguments for `onShortcut` and `streamKeys` converted to named arguments;
- [x] Method `setDependencies` to add objects to the "**dependencies**" object available as named argument in all action functions;
- [x] Method `getDependencies` to look at existing `dependencies` list;
- [x] Methods `onShortcut` and `streamKeys` have a new argument `dependencies` to pass dependencies to the callback;
- [x] Dependencies are aviailable for `emit` method as well as first argument;
- [x] JSdoc type description for public methods;
- [x] Tag <a> is always a target, regardless of argument 'data-click'. Tag <a> is always a `data-quick-click` target also;



### 1.1.1 (2023-09-30)
- [x] Mouse faster response when maxClicks achived. (maxClicks is automatically calculated according shortcut definitions);



### 1.1.0 (2023-09-30)
- [x] Method `emit` was added. Not documented yet;



### 1.0.1 (2023-09-23)
- [x] Mouse click: preventDefault();
- [x] Dependencies update: @peter.naydenov/notice - v.2.2.1



### 1.0.0 (2023-08-14)
 
 - [x] Initial code;
 - [x] Test package;
 - [x] Documentation;


