import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "mirogen-early-booking-landing-20260813";
const basePath = `/${repositoryName}`;
const outputDir = resolve("out");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(resolve("dist/client"), outputDir, { recursive: true });

const server = await import(pathToFileURL(resolve("dist/server/index.js")).href);
const request = new Request(`http://localhost${basePath}/`, {
  headers: { accept: "text/html" },
});
const response = await server.default.fetch(request, {}, { waitUntil() {} });

if (!response.ok) {
  throw new Error(`Static HTML export failed with status ${response.status}`);
}

const html = await response.text();
if (!html.includes("Отель «Мироген»") || !html.includes("раннего бронирования")) {
  throw new Error("Static HTML export is missing the expected page content");
}

await writeFile(resolve(outputDir, "index.html"), html, "utf8");
console.log(`Pages artifact written to ${outputDir}`);
