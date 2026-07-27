import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { z } from "zod";
import { BeamFilesystemError } from "../errors.js";
import { createBeamPaths } from "../config/paths.js";
import { createCacheKey, type CacheKeyInput } from "./cache-key.js";
import { evaluateFreshness } from "./freshness-policy.js";

const cacheEntrySchema = z.object({
  schemaVersion: z.literal("1.0"),
  key: z.string().min(1),
  createdAt: z.string().datetime(),
  value: z.unknown(),
});

export type CacheReadResult =
  | { hit: true; value: unknown; path: string; createdAt: string }
  | {
      hit: false;
      path: string;
      reason: "missing" | "corrupt" | "refresh_requested" | "expired";
    };

export class CacheManager {
  private readonly cacheDir: string;

  constructor(input: { cwd?: string; cacheDir?: string } = {}) {
    this.cacheDir =
      input.cacheDir ?? createBeamPaths({ cwd: input.cwd }).cacheDir;
  }

  async read(
    input: CacheKeyInput & { refresh?: boolean; maxAgeMinutes?: number },
  ): Promise<CacheReadResult> {
    const key = createCacheKey(input);
    const path = this.pathForKey(key);

    try {
      const parsed = cacheEntrySchema.parse(
        JSON.parse(await readFile(path, "utf8")),
      );
      const freshness = evaluateFreshness({
        refresh: input.refresh,
        createdAt: parsed.createdAt,
        maxAgeMinutes: input.maxAgeMinutes,
      });

      if (!freshness.useCache) {
        return { hit: false, path, reason: freshness.reason };
      }

      return {
        hit: true,
        value: parsed.value,
        path,
        createdAt: parsed.createdAt,
      };
    } catch (error) {
      if (isNodeError(error, "ENOENT")) {
        return { hit: false, path, reason: "missing" };
      }

      return { hit: false, path, reason: "corrupt" };
    }
  }

  async write(
    input: CacheKeyInput & { value: unknown; createdAt?: string },
  ): Promise<string> {
    const key = createCacheKey(input);
    const path = this.pathForKey(key);
    const entry = {
      schemaVersion: "1.0",
      key,
      createdAt: input.createdAt ?? new Date().toISOString(),
      value: input.value,
    };

    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, `${JSON.stringify(entry, null, 2)}\n`);
      return path;
    } catch {
      throw new BeamFilesystemError(
        "BEAM_CACHE_WRITE_FAILED",
        "Beam could not write local cache.",
      );
    }
  }

  pathForKey(key: string): string {
    return join(this.cacheDir, "raw", `${key}.json`);
  }
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
