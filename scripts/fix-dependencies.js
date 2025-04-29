// This script creates a temporary package to satisfy the dependency
const fs = require("fs")
const path = require("path")

// Create directory for the temporary package
const tempDir = path.join(__dirname, "../node_modules/@radix-ui/accordion")
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

// Create a package.json for the temporary package
const packageJson = {
  name: "@radix-ui/accordion",
  version: "1.0.0",
  main: "index.js",
  dependencies: {
    "@radix-ui/react-accordion": "^1.1.2",
  },
}

// Create an index.js that re-exports from the real package
const indexJs = `
module.exports = require('@radix-ui/react-accordion');
`

// Write the files
fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(packageJson, null, 2))
fs.writeFileSync(path.join(tempDir, "index.js"), indexJs)

console.log("Created temporary @radix-ui/accordion package")
