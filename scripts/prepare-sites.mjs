import { cp, mkdir, writeFile } from 'node:fs/promises'

const workerSource = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404) {
      return response
    }

    if (
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html")
    ) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url)))
    }

    return response
  },
}
`

const dist = new URL('../dist/', import.meta.url)
const client = new URL('../dist/client/', import.meta.url)

await mkdir(client, { recursive: true })
await cp(new URL('index.html', dist), new URL('index.html', client))
await cp(new URL('assets', dist), new URL('assets', client), { recursive: true })
await cp(new URL('icons', dist), new URL('icons', client), { recursive: true })
await cp(new URL('images', dist), new URL('images', client), { recursive: true })
await cp(
  new URL('manifest.webmanifest', dist),
  new URL('manifest.webmanifest', client),
)
await cp(new URL('og.png', dist), new URL('og.png', client))
await cp(new URL('sw.js', dist), new URL('sw.js', client))
await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../dist/server/index.js', import.meta.url),
  workerSource,
  'utf8',
)
