import { build } from "esbuild";
import { copyFile, mkdir } from "node:fs/promises";

// Figma runs code.js in its sandbox and ui.html in an iframe; both must be single files.
await mkdir("dist", { recursive: true });
await build({ entryPoints: ["src/code.ts"], outfile: "dist/code.js", bundle: true, format: "iife", target: "es2020", logLevel: "silent" });
await copyFile("src/ui.html", "dist/ui.html");
