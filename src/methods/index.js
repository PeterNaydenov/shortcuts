import _normalizeWithPlugins from './_normalizeWithPlugins.js'
import _systemAction         from './_systemAction.js'

import load           from './load.js'
import unload         from './unload.js'
import changeContext  from './changeContext.js'
import listShortcuts  from './listShortcuts.js'



export default {
// Internal methods
   _normalizeWithPlugins
 , _systemAction
    
// Public methods
  , changeContext
  , listShortcuts
  , load
  , unload
}