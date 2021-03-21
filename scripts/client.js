const common = require("./common")
const esbuild = require("esbuild")
const fs = require("fs")
const path = require("path")

const reactVersion = "17-0-1"
const epochVersion = Math.random().toString(36).slice(2, 8)

async function main() {
	let sources = await fs.promises.readdir("out")
	sources = sources.map(source => path.join("out", source))
	sources = sources.filter(source => source.endsWith(".js") || source.endsWith(".js.map"))
	for (const source of sources) {
		await fs.promises.unlink(source)
	}

	try {
		await esbuild.build({
			...common,

			bundle: true,
			entryPoints: ["scripts/shim_vendor.js"],
			outfile: `out/vendor__${reactVersion}.esbuild.js`,
		})

		await esbuild.build({
			...common,

			bundle: true,
			entryPoints: ["src/index.js"],
			outfile: `out/client__${epochVersion}.esbuild.js`,

			// Dedupe React APIs and defer to vendors
			external: ["react", "react-dom"],
			inject: ["scripts/shim_require.js"], // Vendors
		})

		const buffer = await fs.promises.readFile("out/index.html")

		let contents = ""
		contents = buffer.toString()
		contents = contents.replace(
			/<script src="\.\/vendor[^"]+"><\/script>/,
			`<script src="./vendor__${reactVersion}.esbuild.js"></script>`,
		)
		contents = contents.replace(
			/<script src="\.\/client[^"]+"><\/script>/,
			`<script src="./client__${epochVersion}.esbuild.js"></script>`,
		)

		await fs.promises.writeFile("out/index.html", contents)
	} catch (error) {
		console.error(error)
		process.exit(0)
	}
}

main()
