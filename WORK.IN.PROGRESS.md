# Progress

√ Attached to js-pages to upgrade the usability of the library.
√ Take care about 1 click lag. Idea is to add html element attribute to not wait for more then 1 click: `data-quick-click`;
√ HTML element attributes in documentation;
√ Add access to dependencies from `emit` method;
√ Pause not working;
√ Describe in  docs how to pause and resume;
√ Add method `listShortcuts` to get names of all shortcuts defined;
√ Arguments for `onShortcut` and `streamKeys` converted to named arguments;
√ Methods `onShortcut` and `streamKeys` have a new argument `dependencies` to pass dependencies to the callback;
√ Full refactoring of the library for better readability and maintainability;
√ Add jsdoc type description for public methods;
- Page links <a> should work. At the moment we block them with `event.preventDefault()`;
- Migration instructions from v1 to v2. Create the file and fullfill it;