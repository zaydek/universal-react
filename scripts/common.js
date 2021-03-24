const env = process.env.NODE_ENV ?? "development"

module.exports = {
	define: {
		__DEV__: JSON.stringify(env !== "production"),
		"process.env.NODE_ENV": JSON.stringify(env),
	},
	loader: {
		".js": "jsx",
	},
	minify: env === "production",
	sourcemap: true,
}
