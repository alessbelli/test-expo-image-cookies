export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/json") {
      return handleJson(request)
    }

    if (url.pathname === "/image.svg") {
      return handleSvg(request)
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain"
      }
    })
  }
}

function buildCookie(routeName) {
  const value = new Date().toISOString()
  return `${routeName}=${value}; Path=/`
}

function handleJson(request) {
  const headersObject = Object.fromEntries(request.headers.entries())

  return new Response(JSON.stringify(headersObject, null, 2), {
    headers: {
      "content-type": "application/json",
      "set-cookie": buildCookie("json")
    }
  })
}

function handleSvg(request) {
  const headerEntries = [...request.headers.entries()]

  const lineHeight = 18
  const startY = 20

  const textLines = headerEntries
    .map(([k, v], i) => {
      const escaped = escapeXml(`${k}: ${v}`)
      const y = startY + i * lineHeight
      return `<text x="10" y="${y}">${escaped}</text>`
    })
    .join("\n")

  const height = startY + headerEntries.length * lineHeight + 20

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="${height}">
  <rect width="100%" height="100%" fill="white"/>
  <g font-family="monospace" font-size="14">
    ${textLines}
  </g>
</svg>
`

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "set-cookie": buildCookie("image")
    }
  })
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
