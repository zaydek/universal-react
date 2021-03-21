const path = require("path")
const React = require("react")
const ReactDOMServer = require("react-dom/server")

const common = require("./common")

async function run() {
	try {
		await require("esbuild").build({
			...common,

			bundle: true,
			entryPoints: ["src/App.js"],
			outfile: "out/app.esbuild.ssr.js",

			// Dedupe React APIs
			external: ["react", "react-dom"],
			format: "cjs",

			// No-ops 'import React from "react"'
			inject: ["scripts/shim_react.js"],
		})
	} catch {}

	const mod = require(path.resolve("out/app.esbuild.ssr.js"))
	console.log(ReactDOMServer.renderToString(React.createElement(mod.default)))
}

run()
