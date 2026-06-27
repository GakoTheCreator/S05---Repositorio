import fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = process.cwd();
const outputRoot = path.join(root, ".reference-pdfs");
const files = (await fs.readdir(root)).filter((file) => file.toLowerCase().endsWith(".pdf"));

await fs.mkdir(outputRoot, { recursive: true });

for (const file of files) {
  const input = path.join(root, file);
  const slug = file.replace(/\.pdf$/i, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  const output = path.join(outputRoot, slug);
  await fs.mkdir(output, { recursive: true });

  const bytes = new Uint8Array(await fs.readFile(input));
  const document = await getDocument({ data: bytes, disableFontFace: true }).promise;
  const text = [];

  for (let index = 1; index <= document.numPages; index += 1) {
    const page = await document.getPage(index);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    await page.render({ canvas, canvasContext: context, viewport }).promise;
    await fs.writeFile(path.join(output, `page-${String(index).padStart(2, "0")}.png`), canvas.toBuffer("image/png"));

    const pageText = await page.getTextContent();
    text.push(`\n===== PAGE ${index} =====\n${pageText.items.map((item) => item.str).join(" ")}`);
  }

  await fs.writeFile(path.join(output, "text.txt"), text.join("\n"), "utf8");
  console.log(`${file}: ${document.numPages} page(s)`);
}
