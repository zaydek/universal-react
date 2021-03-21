// On the server, use useEffect
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export default function App() {
	const [state, setState] = React.useState("world")

	useIsoLayoutEffect(() => {
		console.log("Hello, world!")
	}, [state])

	console.log(typeof window === "undefined" ? "server" : "client")
	return <h1 onClick={() => setState("oops")}>Hello, {state}!</h1>
}
