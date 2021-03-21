const env = process.env.NODE_ENV ?? "development"

module.exports = {
	// Add __DEV__, NODE_ENV, and process.env.NODE_ENV
	// prettier-ignore
	define: {
		"__DEV__":JSON.stringify(env !== "production"),
		"process.env.NODE_ENV": JSON.stringify(env),
	},
	// Interpret JavaScript as JavaScript XML
	loader: {
		".js": "jsx",
	},

	minify: env === "production",

	// Add sourcemaps
	sourcemap: true,
}
