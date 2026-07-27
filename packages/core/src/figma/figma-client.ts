import { BeamAuthError, BeamFigmaApiError } from "../errors.js";
import {
  DEFAULT_FIGMA_API_BASE_URL,
  fileEndpoint,
  fileNodesEndpoint,
  imagesEndpoint,
  variablesEndpoint,
} from "./endpoints.js";
import { rateLimitErrorFromResponse } from "./rate-limit-manager.js";
import { RequestScheduler } from "./request-scheduler.js";

export type FigmaClientOptions = {
  accessToken: string;
  apiBaseUrl?: string;
  fetch?: typeof fetch;
  scheduler?: RequestScheduler;
};

export class FigmaClient {
  private readonly accessToken: string;
  private readonly apiBaseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly scheduler: RequestScheduler;

  constructor(options: FigmaClientOptions) {
    if (!options.accessToken) {
      throw new BeamAuthError();
    }

    this.accessToken = options.accessToken;
    this.apiBaseUrl = options.apiBaseUrl ?? DEFAULT_FIGMA_API_BASE_URL;
    this.fetchImpl = options.fetch ?? fetch;
    this.scheduler = options.scheduler ?? new RequestScheduler();
  }

  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<unknown> {
    return this.request(
      fileNodesEndpoint(fileKey, nodeIds),
      "GET /v1/files/:file_key/nodes",
    );
  }

  async getFile(fileKey: string): Promise<unknown> {
    return this.request(fileEndpoint(fileKey), "GET /v1/files/:file_key");
  }

  async getImages(
    fileKey: string,
    nodeIds: string[],
    options: {
      format?: "png" | "jpg" | "svg" | "pdf";
      scale?: 1 | 2 | 3 | 4;
    } = {},
  ): Promise<unknown> {
    return this.request(
      imagesEndpoint(fileKey, nodeIds, options),
      "GET /v1/images/:file_key",
    );
  }

  async getVariables(fileKey: string): Promise<unknown> {
    return this.request(
      variablesEndpoint(fileKey),
      "GET /v1/files/:file_key/variables/local",
    );
  }

  private async request(path: string, endpointName: string): Promise<unknown> {
    const url = new URL(path, `${this.apiBaseUrl.replace(/\/$/, "")}/`);
    const scheduled = this.scheduler.schedule(
      url.toString(),
      async (requestId) => {
        const response = await this.fetchImpl(url, {
          headers: {
            "X-Figma-Token": this.accessToken,
            "X-Beam-Request-Id": requestId,
          },
        });

        if (response.status === 401 || response.status === 403) {
          throw new BeamAuthError(
            "Figma authentication failed. Run beam login again.",
          );
        }

        if (response.status === 429) {
          throw rateLimitErrorFromResponse(response, endpointName);
        }

        if (!response.ok) {
          throw new BeamFigmaApiError("Figma API request failed.", {
            status: response.status,
            endpoint: endpointName,
          });
        }

        return response.json();
      },
    );

    return scheduled.result;
  }
}
