import { EvidenceStore, type UserEvidenceKind } from "@beam/core";
import { heading, jsonBlock, label, path, success } from "../terminal.js";

export type EvidenceCommandOptions = {
  image?: string;
  asset?: string;
  reference?: string;
  note?: string;
  confirm?: string;
  label?: string;
  json?: boolean;
  cwd?: string;
};

export async function evidenceCommand(
  action: string,
  snapshotId: string,
  options: EvidenceCommandOptions,
): Promise<void> {
  const store = new EvidenceStore({ cwd: options.cwd ?? process.cwd() });
  if (action === "list") {
    writeEvidenceOutput(
      { evidence: await store.list(snapshotId) },
      options.json,
    );
    return;
  }
  if (action !== "add")
    throw new Error(`Unsupported evidence action: ${action}`);
  const input = evidenceInput(snapshotId, options);
  writeEvidenceOutput({ evidence: await store.add(input) }, options.json);
}

function evidenceInput(snapshotId: string, options: EvidenceCommandOptions) {
  const file = options.image ?? options.asset ?? options.reference;
  const text = options.note ?? options.confirm;
  const kind: UserEvidenceKind = options.image
    ? "image"
    : options.asset
      ? "asset"
      : options.reference
        ? "reference"
        : options.note
          ? "note"
          : "confirmation";
  return {
    snapshotId,
    kind,
    label: options.label ?? kind,
    ...(file ? { filePath: file } : {}),
    ...(text ? { text } : {}),
  };
}

function writeEvidenceOutput(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${jsonBlock(value)}\n`);
    return;
  }
  const record = (value as { evidence?: { storedPath?: string } }).evidence;
  process.stdout.write(
    `${heading("Beam evidence")}\n\n${success("Evidence updated")}\n${
      record?.storedPath ? `${label("Path", path(record.storedPath))}\n` : ""
    }${jsonBlock(value)}\n`,
  );
}
