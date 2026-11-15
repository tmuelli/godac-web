import { ApiError, readError } from "./error";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await readError(response);
    throw new ApiError(response.status, message);
  }

  const data = await response.json();
  return data as T;
}

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(path);
  return handle<T>(response);
}

export async function post<T, B = unknown>(path: string, body: B): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handle<T>(response);
}
