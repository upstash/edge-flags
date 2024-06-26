#!/usr/bin/env node

const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const opener = require("opener")

// CD into the script path
process.chdir(__dirname)

const hostname = "localhost"

const argv = require("minimist")(process.argv.slice(2), {
  alias: {
    p: "port",
    h: "help",
  },
})

if (argv.help) {
  console.log(
    `
Usage: @upstash/edge-flags-dashboard [options]

Options:
  -p, --port <port>  Port number to listen on
  -h, --help         Show this help message
  `.trimStart()
  )
  process.exit(0)
}

const port = parseInt(argv.port || process.env.PORT || "3000", 10)

const app = next({ dev: false, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)

      opener(`http://${hostname}:${port}`)
    })
})
