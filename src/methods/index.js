import _normalizeWithPlugins    from './_normalizeWithPlugins.js'
import _readShortcutWithPlugins from './_readShortcutWithPlugins.js'
import _systemAction            from './_systemAction.js'

import load           from './load.js'
import unload         from './unload.js'
import changeContext  from './changeContext.js'
import listShortcuts  from './listShortcuts.js'
import _setupPlugin   from './_setupPlugin.js'



export default {
// Internal methods
   _normalizeWithPlugins
 , _readShortcutWithPlugins
 , _setupPlugin
 , _systemAction
    
// Public methods
  , changeContext
  , listShortcuts
  , load
  , unload
}