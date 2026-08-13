import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the hotel landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="ru"/i);
  assert.match(html, /Отель «Мироген»/i);
  assert.match(html, /Раннее бронирование/i);
  assert.match(html, /Проверить даты и условия/i);
  assert.match(html, /hotelmirogen@yandex\.ru/i);
  assert.doesNotMatch(html, /2025|июньская|COVID|заглушка|TODO|\bAI\b/i);
});

test("keeps the offer data centralized and starter artifacts removed", async () => {
  const [page, data, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(data, /deadline: null/);
  assert.match(data, /hotelmirogen@yandex\.ru/);
  assert.match(data, /https:\/\/wa\.me\/79181872888/);
  assert.match(page, /utm_source/);
  assert.match(page, /Открыть WhatsApp/);
  assert.doesNotMatch(page, /2025|июньская|COVID|заглушка|TODO|\bAI\b/i);
  assert.doesNotMatch(data, /2025|июньская|COVID|заглушка|TODO|\bAI\b/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
