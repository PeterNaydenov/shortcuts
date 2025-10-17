async function setup () {
                    let st = document.createElement ( 'style' )
                    st.textContent = cssCode
                    document.head.appendChild ( st )
                    await waitFor ( () => {
                        expect ( document.head ).to.have.property ( 'style' )
                    })
                    

                    let container = document.createElement ( 'div' )
                    container.id = 'app'
                    document.body.appendChild ( container )
                    html.publish ( Block, {}, 'app' )
                    a = false, b = false
} // setup func.


export default setup