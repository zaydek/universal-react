module.exports = {
	define: {
		// "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	loader: {
		".js": "jsx",
	},
}
