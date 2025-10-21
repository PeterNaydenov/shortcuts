## Release History



### 3.5.3 ( 2025-10-21 )
- [x] Code: Plugin 'form' upgrade. Now you can take 'dependencies' on 'form:action' level. It's higher level that all declared actions can use. Minimize 'dependencies' declarations. Other named arguments are not available on top level;
- [x] Code: Plugin 'form' uses general app error event;



### 3.5.2 ( 2025-10-20 )
- [x] Types update;



### 3.5.1 ( 2025-10-20 )
- [x] Update in package.json. Field 'types' was added;



### 3.5.0 ( 2025-10-19)
- [x] Featire: New method 'listPlugins' to get list of enabled plugins;
- [x] Upgrade: Improvment of type definitions. New d.ts files were added;



### 3.4.0 ( 2025-10-18)
- [x] Feature: New method 'reset' to reset the library instance;
- [x] Refactoring: Added 'active' state property to 'click' plugin state management;
- [x] Test: Migrated Vitest configuration from deprecated workspace files to modern format;
- [x] Test: Added @vitest/ui package for interactive test interface;
- [x] Test: Updated click and key plugin tests for better reliability;
- [x] Dev deps update. @rollup/plugin-commonjs to v.28.0.8;
- [x] Dev deps update. Playwright to v.1.56.1;
- [x] Fix: Cleaning plugin-state variables on plugin stop;
- [x] Fix: Wrong plugin name detection in 'enablePlugin' method;
- [x] Fix: Custom events for plugins with works only with nomrmalized event-names. Fixed - event name normalization could be done from the enabled plugins;



### 3.3.1 ( 2025-10-10)
- [x] Fix: Fail to react on 'key:specialCharacters' events
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.3.0 ( 2025-09-29)
- [x] Dependency updates and new build;
- [ ] Bug: Fail to react on 'key:specialCharacters' events
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;


### 3.2.1 ( 2025-08-15)
- [x] Fix: Old build files were not deleted after release.
- [ ] Bug: Fail to react on 'key:specialCharacters' events
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;


### 3.2.0 ( 2025-08-15)
- [x] Plugin 'form' was added. It allows you to listen for form elements changes.
- [ ] Miss: Old build files were not deleted after release.
- [ ] Bug: Fail to react on 'key:specialCharacters' events
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.1.4 ( 2025-05-3)
- [x] Dependency update. @peter.naydenov/notice - v.2.4.1
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;


### 3.1.3 ( 2025-01-12)
- [x] Dependency update. @peter.naydenov/notice - v.2.4.0
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.1.2 ( 2024-12-23 )
- [x] Dependency update. @peter.naydenov/notice - v.2.3.2
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.1.1 ( 2024-03-15 )
- [x] Update: Using @peter.naydenov/notice v.2.3.1: Fix: Callback stop will stop the wildcard callbacks as well;
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.1.0 ( 2024-03-14 )
- [x] Using @peter.naydenov/notice v.2.3.0: If action function returns a string 'stop' and execution of followed action functions will be stopped. Option to build a chain of conditional action functions before the main action function;
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



### 3.0.1 ( 2024-03-06 )
- [x] Fix: Library works again;
- [ ] Bug: Cleaning plugin-state variables on plugin stop;
- [ ] Bug: Wrong plugin name detection in 'enablePlugin' method;
- [ ] Bug: Custom events for plugins with works only with nomrmalized event-names;



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


