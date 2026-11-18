import type { ApiErrorBody } from "../types/types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

export async function readError(response: Response): Promise<string> {
  try {
    const err = await response.json();
    const body = err as ApiErrorBody;
    return body.message;
  } catch {
    return `HTTP ${response.status}`;
  }
}
