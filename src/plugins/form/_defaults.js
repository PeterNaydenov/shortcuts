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


