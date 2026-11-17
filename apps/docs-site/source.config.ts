import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  // Keep each page's processed Markdown so "Copy Markdown" and agents get clean text.
  docs: { postprocess: { includeProcessedMarkdown: true } },
});

export default defineConfig();
