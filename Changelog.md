## Release History



### 2.0.0 ( 2023-10-14 )
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


