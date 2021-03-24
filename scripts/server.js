const common = require("./common")
const fs = require("fs")
const path = require("path")
const React = require("react")
const ReactDOMServer = require("react-dom/server")

async function run() {
	try {
		await require("esbuild").build({
			...common,

			bundle: true,
			entryPoints: ["src/App0.js"],
			outfile: "out/app.esbuild.ssr.js",

			// Dedupe React APIs
			external: ["react", "react-dom"],
			format: "cjs",

			// No-ops 'import React from "react"'
			inject: ["scripts/shim_react.js"],
		})

		const mod = require(path.resolve("out/app.esbuild.ssr.js"))
		const markup = ReactDOMServer.renderToString(React.createElement(mod.default))
		console.log(markup)

		// const buffer = await fs.promises.readFile("out/index.html")
		//
		// let contents = buffer.toString()
		// contents = contents.replace(/<div id="root">.*<\/div>$/m, `<div id="root">${markup}</div>`)
		//
		// await fs.promises.writeFile("out/index.html", contents)
	} catch (error) {
		console.error(error)
		process.exit(0)
	}
}

run()
