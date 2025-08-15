const _defaults = {
      watch : () => 'input, select, textarea, button, a'
    , define: (el) => {
            if ( el.type === 'checkbox' || el.type === 'radio' ) {
                    return 'checkbox'
                }
            if ( el.type == 'button' || el.type=='submit' ) {
                    return 'button'
                }
            return 'input'
        } // define
} // defaults



export default _defaults


