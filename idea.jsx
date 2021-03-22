import React from "react"
import ReactDOM from "react-dom"

function Component() {
	return <h1 for="lol">Hello, world!</h1>
}

ReactDOM.render(
	<React.StrictMode>
		<Component />
	</React.StrictMode>,
	document.getElementById("root"),
)
