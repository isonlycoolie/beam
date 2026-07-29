export type UserEvidenceKind =
  "image" | "asset" | "reference" | "note" | "confirmation";

export type UserEvidenceRecord = {
  id: string;
  snapshotId: string;
  kind: UserEvidenceKind;
  label: string;
  createdAt: string;
  sourcePath?: string;
  storedPath?: string;
  text?: string;
};

export type AddEvidenceInput = {
  snapshotId: string;
  kind: UserEvidenceKind;
  label: string;
  filePath?: string;
  text?: string;
};
