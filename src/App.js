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

function CSS({ href, children }) {
	// const [loadedCSS, setLoadedCSS] = useState(false)

	React.useLayoutEffect(() => {
		let stylesheet = document.getElementById("__stylesheet__")
		if (stylesheet === null) {
			// Create __stylesheet__ (once)
			const el = document.createElement("link")
			el.setAttribute("id", "__stylesheet__")
			el.setAttribute("rel", "stylesheet")
			document.head.appendChild(el)
			stylesheet = el
		}
		// stylesheet.removeAttribute("disabled")
		stylesheet.setAttribute("href", href)
	}, [href])

	return children
}

function Slash() {
	return (
		<div className="Slash">
			<h1>Hello, world! (/)</h1>
		</div>
	)
}

function SlashFoo() {
	return (
		<div className="SlashFoo">
			<h1>Hello, world! (/foo)</h1>
		</div>
	)
}

function SlashFooBar() {
	return (
		<div className="SlashFooBar">
			<h1>Hello, world! (/foo/bar)</h1>
		</div>
	)
}

const stylesheets = {
	"/": "/Slash.css",
	"/foo": "/SlashFoo.css",
	"/foo/bar": "/SlashFooBar.css",
}

// export default function App() {
// 	// Imports
// 	const { Route, Router } = router
//
// 	const routerState = router.useRouter()
// 	const [loadedCSS, setLoadedCSS] = React.useState(0)
//
// 	React.useLayoutEffect(() => {
// 		// prettier-ignore
// 		function loadCSS(href) {
// 			return new Promise((resolve, reject) => {
// 				setTimeout(() => {
// 					const stylesheet = document.createElement("link")
// 					stylesheet.rel = "stylesheet" // <link rel="stylesheet">
// 					stylesheet.href = href        // <link href={href}>
// 					stylesheet.onload = resolve
// 					stylesheet.onerror = reject
// 					document.head.appendChild(stylesheet)
// 				}, 1_000)
// 			})
// 		}
// 		async function load() {
// 			await loadCSS(stylesheets[routerState.path])
// 			setLoadedCSS(current => current + 1)
// 		}
// 		load()
// 	}, [routerState.path])
//
// 	return React.useMemo(
// 		() => (
// 			<div>
// 				{JSON.stringify(loadedCSS)}
//
// 				<Nav />
// 				<Router>
// 					<Route path="/">
// 						<Slash />
// 					</Route>
// 					<Route path="/foo">
// 						<SlashFoo />
// 					</Route>
// 					<Route path="/foo/bar">
// 						<SlashFooBar />
// 					</Route>
// 				</Router>
// 			</div>
// 		),
// 		[loadedCSS],
// 	)
// }

function useOnce() {
	const once = React.useRef(false)
	return effect => {
		if (!once.current) {
			once.current = true
			return
		}
		return effect
	}
}

function useDebouncedEffect(effect, deps, debouncedMS) {
	React.useEffect(() => {
		const id = setTimeout(() => {
			return effect()
		}, debouncedMS)
		return () => clearTimeout(id)
	}, deps)
}

function sleep(forMS) {
	return new Promise(resolve => setTimeout(resolve, forMS))
}

export default function App() {
	const [count, setCount] = React.useState(() => 0)
	const [delayedCount, setDelayedCount] = React.useState(() => count)

	const once = useOnce()
	useDebouncedEffect(
		once(() => {
			async function fn() {
				await sleep(750)
				setDelayedCount(current => current + 1)
			}
			fn()
		}),
		[count],
		1_000,
	)

	return React.useMemo(
		() => (
			<h1 onClick={() => setCount(current => current + 1)}>
				{count}
				<br />
				{delayedCount}
			</h1>
		),
		[delayedCount],
	)
}
