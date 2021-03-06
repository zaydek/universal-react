const common = require("./common")
const esbuild = require("esbuild")
const fs = require("fs")
const path = require("path")

const reactVersion = "xx" // "17-0-1"
const epochVersion = "xx" // Math.random().toString(36).slice(2, 8)

// // Based on https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
// const cssFilePlugin = {
// 	name: "css-file",
// 	setup(build) {
// 		const path = require("path")
//
// 		build.onResolve({ filter: /\.css$/ }, args => {
// 			return {
// 				path: path.join(args.resolveDir, args.path),
// 				namespace: "css-file",
// 			}
// 		})
//
// 		build.onLoad({ filter: /.*/, namespace: "css-file" }, async args => {
// 			const outfile = path.join("out", path.relative(path.join(process.cwd(), "src"), args.path))
//
// 			// console.log("here", path.join("out", path.relative(path.join(process.cwd(), "src"), args.path)))
// 			// console.log()
//
// 			const result = await esbuild.build({
// 				bundle: true,
// 				entryPoints: [args.path],
// 				outfile,
// 				// write: false,
// 			})
//
// 			// console.log(result.outputFiles[0].text)
//
// 			return {
// 				contents: result.outputFiles[0].text,
// 				loader: "css",
// 			}
// 		})
// 	},
// }

async function main() {
	let sources = await fs.promises.readdir("out")
	sources = sources.map(source => path.join("out", source))
	sources = sources.filter(source => source.endsWith(".css") || source.endsWith(".js") || source.endsWith(".js.map"))
	for (const source of sources) {
		await fs.promises.unlink(source)
	}

	// TODO: Builds can be processed concurrently
	try {
		// React, React DOM
		await esbuild.build({
			...common,

			bundle: true,
			entryPoints: ["scripts/shim_vendor.js"],
			outfile: `out/vendor__${reactVersion}.esbuild.js`,
		})

		// CSS
		await esbuild.build({
			...common,
			// bundle: true,
			// prettier-ignore
			entryPoints: [
				"src/Slash.css",
				"src/SlashFoo.css",
				"src/SlashFooBar.css",
			],
			// outfile: `out/vendor__${reactVersion}.esbuild.js`,
			outdir: "out",
		})

		// App
		await esbuild.build({
			...common,

			bundle: true,
			entryPoints: ["src/index.js"],
			outfile: `out/client__${epochVersion}.esbuild.js`,

			// Dedupe React APIs and defer to vendors
			external: ["react", "react-dom"],
			inject: ["scripts/shim_require.js"], // Vendors

			// plugins: [cssFilePlugin],
		})
	} catch {}

	// const buffer = await fs.promises.readFile("out/index.html")
	//
	// let contents = buffer.toString()
	// contents = contents.replace(
	// 	/<script src="\.\/vendor[^"]+"><\/script>/,
	// 	`<script src="./vendor__${reactVersion}.esbuild.js"></script>`,
	// )
	// contents = contents.replace(
	// 	/<script src="\.\/client[^"]+"><\/script>/,
	// 	`<script src="./client__${epochVersion}.esbuild.js"></script>`,
	// )
	//
	// await fs.promises.writeFile("out/index.html", contents)

	console.log("done")
}

main()
