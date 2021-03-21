const common = require("./common")

async function main() {
	try {
		await require("esbuild").build({
			...common,

			bundle: true,
			entryPoints: ["scripts/shim_vendor.js"],
			outfile: "out/vendor.esbuild.js",
		})

		await require("esbuild").build({
			...common,

			bundle: true,
			entryPoints: ["src/index.js"],
			outfile: "out/client.esbuild.js",

			// Dedupe React APIs and defer to vendors
			external: ["react", "react-dom"],
			inject: ["scripts/shim_require.js"], // Vendors
		})
	} catch {}
}

main()
