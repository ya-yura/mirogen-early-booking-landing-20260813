import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const publicFiles = ["app/page.tsx", "app/data.ts", "app/layout.tsx"];
const forbiddenContent = [
  /июн/i,
  /2025/i,
  /covid/i,
  /заглуш/i,
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bAI\b/i,
  /23\.08/i,
  /12\.07/i,
  /19\.07/i,
  /7000\s*руб/i,
  /50\s*%/i,
  /сам(ая|ой)\s+выгод/i,
  /гарантирован/i,
  /свободн(?:ые|ых)\s+номер/i,
  /ДВМ\s+улучшеный/i,
];

test("keeps stale or unsupported marketing claims out of public content", async () => {
  const sources = await Promise.all(publicFiles.map((file) => readFile(new URL(file, projectRoot), "utf8")));

  for (const [index, source] of sources.entries()) {
    for (const pattern of forbiddenContent) {
      assert.doesNotMatch(source, pattern, `${publicFiles[index]} contains ${pattern}`);
    }
  }

  await assert.doesNotReject(() => access(new URL("public/images/official/gallery-1.webp", projectRoot)));
});
