function Block () {
return <>
    <div className="block" data-click="red"><span id='rspan'>Red</span> </div>
    <button className="big-btn" data-click="mega">Mega button</button>
    <p>Some text with <a href="#" target="_blank">link <span id="anchor">in</span></a> it</p>
    <p><input id="name" type="text" /></p>
    <p><input type="text" id="age" /></p>
</> 
}


export default Block


