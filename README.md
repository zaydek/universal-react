# universal-react

This is a simple experiment to test how to implement SSR / hydration / a minimal vendor chunking strategy for `react`,
`react-dom`, and esbuild.

This implementation is inspired by this comment: https://github.com/evanw/esbuild/issues/490#issuecomment-718489865.
This repo aims to demonstrate a MVP working example.

## Experiment

`node scripts/client.js` generates `vendor.esbuild.js` and then `client.esbuild.js`, which are already linked in the
`index.html` file. `vendor.esbuild.js` bundles React and React DOM (vendor dependencies) whereas `app.esbuild.js`
bundles `src/index.js`. Note that `react` and `react-dom` are referenced via `window.React` and `window.ReactDOM`.

`node scripts/server.js` generates server-side rendered HTML that can in theory be hydrated on the client using the
`app.esbuild.js` bundle.

Additionally, user-facing source files do not need to import React. This is because `scripts/server.js` uses
`inject: ["shims/react_shim.js"]`. Note that `scripts/client.js` does not / cannot use the this injection because it
leads to `Uncaught ReferenceError: require is not defined`. That being said, we don’t need it because `React` and
`ReactDOM` defer to `window.React` and `window.ReactDOM` automatically. This is only because we’re using `<script>` not
`<script type="module">`.
