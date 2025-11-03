/**
 * @typedef {Object} _defaults
 * @property {function} watch - Function that returns CSS selector for form elements to watch
 * @property {function} define - Function that determines the type of form element
 */

/**
 * @const {_defaults}
 * @description Default configuration for form plugin
 */
const _defaults = {
      watch : () => 'input, select, textarea, button, a'
    , define: ({ target }) => {
            if ( target.type === 'checkbox' || target.type === 'radio' ) {
                    return 'checkbox'
                }
            if ( target.type == 'button' || target.type=='submit' ) {
                    return 'button'
                }
            return 'input'
        } // define
} // defaults



export default _defaults


