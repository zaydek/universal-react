// import "./Slash.css"
// import "./SlashFoo.css"
// import "./SlashFooBar.css"

import * as store from "./store"

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

////////////////////////////////////////////////////////////////////////////////

function getPathname() {
	return typeof window === "undefined" ? "/" : window.location.pathname
}

function getBrowserPath(pathname) {
	let out = pathname
	if (pathname.endsWith("/index.html")) {
		out = pathname.slice(pathname, -"index.html".length) // Keep "/"
	} else if (pathname.endsWith("/index")) {
		out = pathname.slice(pathname, -"index".length) // Keep "/"
	} else if (pathname.endsWith(".html")) {
		out = pathname.slice(pathname, -".html".length)
	}
	return out
}

const routerStore = store.createStore({
	path: getBrowserPath(getPathname()),
	type: "PUSH",
	scrollTo: [0, 0],
})

function useRouterState() {
	return store.useStoreState(routerStore)
}

function Link({ path, scrollTo, children, ...props }) {
	const setRouter = store.useStoreSetState(routerStore)

	function handleClick(e) {
		e.preventDefault()
		setRouter({ type: "PUSH", path, scrollTo })
	}

	const scoped = path.startsWith("/")
	return (
		// prettier-ignore
		<a href={path} target={scoped ? undefined : "_blank"} rel={scoped ? undefined : "noreferrer noopener"}
				onClick={scoped ? handleClick : undefined} {...props}>
			{children}
		</a>
	)
}

function distinct(path) {
	const p1 = getBrowserPath(path)
	const p2 = getBrowserPath(getPathname())
	return p1 !== p2
}

function useRouter() {
	const [router, setRouter] = store.useStore(routerStore)

	useIsoLayoutEffect(() => {
		function handlePopState() {
			setRouter({
				type: "REPLACE",
				path: getBrowserPath(getPathname()),
				scrollTo: [0, 0],
			})
		}

		if (router.type === "PUSH") {
			if (distinct(router.path)) window.history.pushState({}, "", getBrowserPath(router.path))
		} else if (router.type === "REPLACE") {
			if (distinct(router.path)) window.history.replaceState({}, "", getBrowserPath(router.path))
		}

		if (router.scrollTo !== undefined) {
			const x = !Array.isArray(scrollTo) ? 0 : scrollTo[0]
			const y = !Array.isArray(scrollTo) ? scrollTo : scrollTo[1]
			window.scrollTo(x, y)
		}

		window.addEventListener("popstate", handlePopState)
		return () => window.removeEventListener("popstate", handlePopState)
	}, [router])

	return router
}

////////////////////////////////////////////////////////////////////////////////

function Nav() {
	const paths = ["/", "/foo", "/foo/bar"]
	return (
		<ul>
			{paths.map(path => (
				<li key={path}>
					<Link path={path}>
						<>{path}</>
					</Link>
				</li>
			))}
		</ul>
	)
}

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

// function useOnce(effect) {
// 	const once = React.useRef(false)
// 	if (!once.current) {
// 		once.current = true
// 		return () => {} // No-op
// 	}
// 	return effect
// }
//
// function useDebouncedEffect(effect, deps, debouncedMS) {
// 	React.useEffect(() => {
// 		const id = setTimeout(() => effect(debouncedMS), debouncedMS)
// 		return () => clearTimeout(id)
// 	}, [...deps, debouncedMS])
// }
//
// function useDebouncedLayoutEffect(effect, deps, debouncedMS) {
// 	React.useEffect(() => {
// 		const id = setTimeout(() => effect(debouncedMS), debouncedMS)
// 		return () => clearTimeout(id)
// 	}, [...deps, debouncedMS])
// }

const stylesheets = {
	"/": "/Slash.css",
	"/foo": "/SlashFoo.css",
	"/foo/bar": "/SlashFooBar.css",
}

function loadAndMountStylesheet(href) {
	return new Promise((resolve, reject) => {
		const s1 = document.getElementsByClassName("__stylesheet__")?.[0]
		const s2 = document.createElement("link")
		s2.className = "__stylesheet__"
		s2.rel = "stylesheet"
		s2.href = href
		s2.onload = () => {
			if (s1 !== undefined) document.head.removeChild(s1)
			resolve()
		}
		s2.onerror = () => {
			if (s1 !== undefined) document.head.removeChild(s1)
			reject()
		}
		// Mount s2 for onload and onerror
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

// function sleep(forMS) {
// 	return new Promise(resolve => setTimeout(resolve, forMS))
// }

export default function App() {
	const [Component, setComponent] = React.useState(() => () => null)

	const { path } = useRouter()
	useIsoLayoutEffect(() => {
		async function fn() {
			await loadAndMountStylesheet(stylesheets[path])
			setComponent(() => () => <Router path={path} />)
		}
		fn()
	}, [path])

	return <Component />
}
