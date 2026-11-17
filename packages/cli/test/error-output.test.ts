import { describe, expect, it } from "vitest";
import { formatError } from "../src/terminal.js";

describe("formatError", () => {
  it("prints the message, fix and code of a Beam error with its exit code", () => {
    const error = Object.assign(new Error("Figma rejected your token."), {
      payload: {
        code: "BEAM_AUTH_FAILED",
        message: "Figma rejected your token.",
        exitCode: 3,
        fix: "Run beam login.",
      },
    });

    const { text, exitCode } = formatError(error);

    expect(exitCode).toBe(3);
    expect(text).toContain("Figma rejected your token.");
    expect(text).toContain("Run beam login.");
    expect(text).toContain("BEAM_AUTH_FAILED");
    expect(text).not.toContain("at ");
  });

  it("falls back to exit code 1 for unknown errors and shows the stack only when debugging", () => {
    const error = new Error("boom");

    expect(formatError(error).exitCode).toBe(1);
    expect(formatError(error).text).not.toContain(error.stack ?? "");
    expect(formatError(error, { debug: true }).text).toContain("error-output.test");
  });
});
