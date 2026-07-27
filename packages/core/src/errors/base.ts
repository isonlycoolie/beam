import type { BeamErrorPayload } from "./payload.js";

export class BeamError extends Error {
  readonly payload: BeamErrorPayload;

  constructor(payload: BeamErrorPayload) {
    super(payload.message);
    this.name = "BeamError";
    this.payload = payload;
  }
}
