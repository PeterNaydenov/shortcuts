# API reference

## Contents
- [Constructor](#constructor)
- [Instance methods](#instance-methods)
- [Errors](#errors)
- [Exported types](#exported-types)

## Constructor

```js
import { shortcuts } from '@peter.naydenov/shortcuts'
const short = shortcuts ({
      onShortcut     : ( shortcutName, ...args ) => {}   // optional. Called for every fired shortcut
    , errorEventName : '@shortcuts-error'                // optional. Name of the error event
})
```

`onShortcut` receives the normalized shortcut name (e.g. `'KEY:CTRL+S'`) followed by the arguments the actions received: for plugin events the event data object; for `emit` — `{ dependencies, type: 'custom' }` and the emit arguments; for the error event — the message.

## Instance methods

| Method | Returns | Notes |
|---|---|---|
| `enablePlugin ( plugin, options? )` | `void` | Options are the plugin defaults for all contexts. Enabling an already enabled plugin keeps the existing instance |
| `disablePlugin ( name )` | `void` | `name` is the plugin prefix: `'key'`, `'click'`, `'hover'`, `'scroll'`, `'form'` |
| `mutePlugin ( name )` / `unmutePlugin ( name )` | `number` | Stop / restart DOM listening without unloading anything. Returns the plugin index or -1 |
| `listPlugins ()` | `string[]` | Enabled plugin prefixes |
| `load ( definition )` | `void` | `{ contextName: { shortcutName: action \| action[] } }`. Loading an existing context name replaces it. Reloading the active context reactivates it |
| `unload ( contextName )` | `void` | Removes a context. The active context can't be unloaded (error event) |
| `changeContext ( name? )` | `void` | Activate a context. No argument (or `false`) switches all shortcuts off. Unknown name → error event, current context stays |
| `getContext ()` | `string \| null` | Active context name |
| `listContexts ()` | `string[]` | Loaded context names |
| `listShortcuts ()` | `{ context, shortcuts }[]` | All contexts with their normalized shortcut names |
| `listShortcuts ( contextName )` | `string[] \| null` | Normalized names in one context; `null` if it doesn't exist |
| `setNote ( note? )` / `getNote ()` | `void` / `string \| null` | Sub-state of the current context. `setNote ()` clears it. Non-string values are ignored |
| `setDependencies ( deps )` | `void` | Merges keys into the dependency bag (`data.dependencies`) |
| `getDependencies ()` | `object` | The dependency bag, including `emit` |
| `pause ( name? )` / `resume ( name? )` | `void` | Pause / resume one shortcut (prefixed name, e.g. `'key: ctrl+s'`) or all (`'*'`, default) in the active context |
| `emit ( name, ...args )` | `void` | Fire a shortcut or custom event in the active context. Actions receive `{ dependencies, type: 'custom' }` followed by `args` |
| `reset ()` | `void` | Destroys plugins, unloads contexts, deactivates, clears dependencies and `onShortcut`. `errorEventName` is kept |

`data.dependencies.emit ( name, ...args )` inside an action passes `args` to the listeners as they are — no `{ dependencies, type }` object is added. Pass the data you need explicitly.

## Errors

The library never throws for usage errors. It publishes a message on the error event (`'@shortcuts-error'` by default):
- `changeContext ( name )` — the context does not exist
- `unload ( name )` — the context is active, or does not exist
- `form: action` — not a function, or doesn't return an array

Listen by defining the error event name as a shortcut in the active context:

```js
short.load ({ app: { '@shortcuts-error': message => logger.warn ( message ) } })
```

## Exported types

TypeScript types are exported from the package root:

- Library: `ShortcutsAPI`, `ShortcutsOptions`, `Dependencies`, `ContextShortcuts`, `ShortcutDefinition`, `ContextDefinition`, `ShortcutAction`
- Action data: `KeyEventData`, `ClickEventData`, `HoverEventData`, `ScrollEventData`, `FormEventData`, `CustomEventData`, `SetupData`, `KeyStreamData`
- Form: `FormWatchData`, `FormDefineData`, `FormActionData`, `FormAction`, `FormElement`
- Options: `KeyOptions`, `ClickOptions`, `HoverOptions`, `ScrollOptions`, `FormOptions`
- Plugin authoring: `Plugin`, `PluginAPI`, `PluginSettings`, `SetupPlugin`, `PluginListener`

Custom plugins: see `how-to-create-a-plugin.md` in the package root.
