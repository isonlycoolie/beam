export type ScheduledRequest<T> = {
  requestId: string;
  result: Promise<T>;
};

export class RequestScheduler {
  private readonly inFlight = new Map<string, Promise<unknown>>();
  private nextId = 1;

  schedule<T>(
    key: string,
    request: (requestId: string) => Promise<T>,
  ): ScheduledRequest<T> {
    const existing = this.inFlight.get(key);
    if (existing) {
      return { requestId: key, result: existing as Promise<T> };
    }

    const requestId = `req_${this.nextId++}`;
    const result = request(requestId).finally(() => {
      this.inFlight.delete(key);
    });
    this.inFlight.set(key, result);

    return { requestId, result };
  }
}
