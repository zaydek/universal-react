const fs = require("fs")
const path = require("path")

const frameRe = / {4}at (?:([^(]+) )?\(?(.*):(\d+):(\d+)\)?/

type StackFrame = [string, string, string, string]

// interface StackTrace {
// 	error: string
// 	frames: StackFrame[]
// }

function parseV8StackTrace(stackStr: string): StackFrame[] {
	const trace: StackFrame[] = []

	const arr = stackStr.split("\n")
	for (const v of arr) {
		if (!v.startsWith("    at")) {
			continue
		}
		const matches = frameRe.exec(v)
		if (matches === null) throw new Error("Internal error")
		trace.push(matches.slice(1) as StackFrame)
	}
	return trace
}

function rel(source: string): string {
	const cwd = process.cwd()
	if (source.startsWith(path.sep)) {
		source = path.relative(cwd, source)
		// if (source.startsWith("node_modules")) {
		// 	source = path.relative("node_modules", source)
		// }
	}
	return source
}

function prettyTrace(trace: StackFrame[]): string {
	const cwd = process.cwd()

	let arr: string[] = []
	for (const [$1, $2, $3, $4] of trace) {
		// if (path.relative(cwd, $2).startsWith("node:internal") || path.relative(cwd, $2).startsWith("node_modules")) {
		// 	continue
		// }
		if ($1 === undefined) {
			arr.push(`    at ${$2}:${$3}:${$4}`)
			continue
		}
		arr.push(`    at ${$1} (${rel($2)}:${$3}:${$4})`)
	}
	return arr.join("\n")
}

async function run(): Promise<void> {
	try {
		throw new Error("oops")
	} catch (error) {
		// console.log(error.stack)

		const trace = parseV8StackTrace(error.stack)
		const [_, $2, $3, $4] = trace[0]

		const buffer = await fs.promises.readFile($2)
		const contents = buffer.toString()

		console.log(` > ${rel($2)}:${$3}:${$4} error:`, error.message)
		console.log(`    ${$3} | ` + contents.split("\n")[+$3 - 1])
		console.log(`    ${" ".repeat($3.length)} | ` + " ".repeat(+$4) + "^")
		console.log()
		console.log(prettyTrace(trace))
		console.log()
	}
}

run()
