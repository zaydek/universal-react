// import "./Slash.css"
// import "./SlashFoo.css"
// import "./SlashFooBar.css"

import * as router from "./router"

// // On the server, use useEffect
// const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect
// // console.log(typeof window === "undefined" ? "server" : "client")

function Nav() {
	const paths = ["/", "/foo", "/foo/bar"]
	return (
		<ul>
			{paths.map(path => (
				<li key={path}>
					<router.Link path={path}>
						<>{path}</>
					</router.Link>
				</li>
			))}
		</ul>
	)
}

// function CSS({ href, children }) {
// 	// const [loadedCSS, setLoadedCSS] = useState(false)
//
// 	React.useLayoutEffect(() => {
// 		let stylesheet = document.getElementById("__stylesheet__")
// 		if (stylesheet === null) {
// 			// Create __stylesheet__ (once)
// 			const el = document.createElement("link")
// 			el.setAttribute("id", "__stylesheet__")
// 			el.setAttribute("rel", "stylesheet")
// 			document.head.appendChild(el)
// 			stylesheet = el
// 		}
// 		// stylesheet.removeAttribute("disabled")
// 		stylesheet.setAttribute("href", href)
// 	}, [href])
//
// 	return children
// }

function Slash() {
	return (
		<>
			<Nav />
			<div className="Slash">
				<h1>Hello, world! (/)</h1>
			</div>
		</>
	)
}

function SlashFoo() {
	return (
		<>
			<Nav />
			<div className="SlashFoo">
				<h1>Hello, world! (/foo)</h1>
			</div>
		</>
	)
}

function SlashFooBar() {
	return (
		<>
			<Nav />
			<div className="SlashFooBar">
				<h1>Hello, world! (/foo/bar)</h1>
			</div>
		</>
	)
}

function useOnce(effect) {
	const once = React.useRef(false)
	if (!once.current) {
		once.current = true
		return () => {} // No-op
	}
	return effect
}

function useDebouncedEffect(effect, deps, debouncedMS) {
	React.useEffect(() => {
		const id = setTimeout(() => effect(debouncedMS), debouncedMS)
		return () => clearTimeout(id)
	}, [...deps, debouncedMS])
}

function useDebouncedLayoutEffect(effect, deps, debouncedMS) {
	React.useEffect(() => {
		const id = setTimeout(() => effect(debouncedMS), debouncedMS)
		return () => clearTimeout(id)
	}, [...deps, debouncedMS])
}

function sleep(forMS) {
	return new Promise(resolve => setTimeout(resolve, forMS))
}

// export default function App() {
// 	const [count, setCount] = React.useState(() => 0)
// 	const [delayedCount, setDelayedCount] = React.useState(() => count)
//
// 	useDebouncedEffect(
// 		useOnce(debouncedMS => {
// 			async function fn() {
// 				await sleep(1_000 - debouncedMS)
// 				setDelayedCount(current => current + 1)
// 			}
// 			fn()
// 		}),
// 		[count],
// 		250,
// 	)
//
// 	return React.useMemo(
// 		() => (
// 			<h1 onClick={() => setCount(current => current + 1)}>
// 				{count}
// 				<br />
// 				{delayedCount}
// 			</h1>
// 		),
// 		[delayedCount],
// 	)
// }

const stylesheets = {
	"/": "/Slash.css",
	"/foo": "/SlashFoo.css",
	"/foo/bar": "/SlashFooBar.css",
}

function loadStylesheet(href) {
	return new Promise((resolve, reject) => {
		let s1 = document.getElementById("__stylesheet__")
		const s2 = document.createElement("link")
		s2.id = "__stylesheet__"
		s2.rel = "stylesheet"
		s2.href = href
		s2.onload = () => {
			// Synchronously swap stylesheets
			if (s1 !== null) {
				document.head.removeChild(s1)
			}
			resolve()
		}
		s2.onerror = reject
		document.head.appendChild(s2)
	})
}

function Router({ path }) {
	switch (path) {
		case "/":
			return <Slash />
		case "/foo":
			return <SlashFoo />
		case "/foo/bar":
			return <SlashFooBar />
		default:
			return <h1>404</h1>
	}
}

export default function App() {
	const { path } = router.useRouterState()
	const [Component, setComponent] = React.useState(() => () => <h1>Fallback</h1>)

	React.useLayoutEffect(() => {
		async function fn() {
			await loadStylesheet(stylesheets[path])
			setComponent(() => () => <Router path={path} />)
		}
		fn()
	}, [path])

	return <Component />
}
