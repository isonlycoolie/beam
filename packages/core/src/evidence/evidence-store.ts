import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createBeamPaths } from "../config/paths.js";
import { BeamInvalidInputError } from "../errors.js";
import type { AddEvidenceInput, UserEvidenceRecord } from "./evidence-types.js";

export class EvidenceStore {
  private readonly cwd: string;

  constructor(input: { cwd?: string } = {}) {
    this.cwd = input.cwd ?? process.cwd();
  }

  async add(input: AddEvidenceInput): Promise<UserEvidenceRecord> {
    if (!input.label.trim())
      throw new BeamInvalidInputError("Evidence label is required.");
    const records = await this.list(input.snapshotId);
    const record = await this.createRecord(input, records.length + 1);
    await mkdir(this.dir(input.snapshotId), { recursive: true });
    await writeFile(
      this.manifestPath(input.snapshotId),
      `${JSON.stringify([...records, record], null, 2)}\n`,
    );
    return record;
  }

  async list(snapshotId: string): Promise<UserEvidenceRecord[]> {
    try {
      return JSON.parse(await readFile(this.manifestPath(snapshotId), "utf8"));
    } catch {
      return [];
    }
  }

  private async createRecord(
    input: AddEvidenceInput,
    index: number,
  ): Promise<UserEvidenceRecord> {
    const createdAt = new Date().toISOString();
    const id = `evidence_${String(index).padStart(3, "0")}`;
    const base = {
      id,
      snapshotId: input.snapshotId,
      kind: input.kind,
      label: input.label,
      createdAt,
    };
    if (input.kind === "note" || input.kind === "confirmation") {
      if (!input.text?.trim())
        throw new BeamInvalidInputError("Evidence text is required.");
      return { ...base, text: input.text };
    }
    if (!input.filePath)
      throw new BeamInvalidInputError("Evidence file path is required.");
    await stat(input.filePath);
    const storedPath = `.beam/evidence/${input.snapshotId}/${id}-${sanitize(input.label)}${extname(input.filePath)}`;
    await mkdir(this.dir(input.snapshotId), { recursive: true });
    await copyFile(input.filePath, join(this.cwd, storedPath));
    return { ...base, sourcePath: input.filePath, storedPath };
  }

  private dir(snapshotId: string): string {
    return join(
      createBeamPaths({ cwd: this.cwd }).projectBeamDir,
      "evidence",
      snapshotId,
    );
  }

  private manifestPath(snapshotId: string): string {
    return join(this.dir(snapshotId), "manifest.json");
  }
}

function sanitize(value: string): string {
  return value
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
