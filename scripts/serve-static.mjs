import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "out");
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", `http://${request.headers.host}`).pathname);
    const safePath = pathname.replace(/^\/+/, "");
    let filePath = path.join(root, safePath);
    const info = await stat(filePath).catch(() => null);
    if (!info || info.isDirectory()) filePath = path.join(filePath, "index.html");
    const data = await readFile(filePath);
    response.writeHead(200, { "content-type": types[path.extname(filePath)] ?? "application/octet-stream" });
    response.end(data);
  } catch {
    const data = await readFile(path.join(root, "404.html"));
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(data);
  }
}).listen(port, () => console.log(`Static export at http://localhost:${port}`));
