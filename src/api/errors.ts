import type { ErrorEnvelope, ErrorType, FieldErrors } from './api.types';

export class ApiError extends Error {
  readonly status: number;
  readonly type: ErrorType | 'UnknownError' | 'NetworkError';
  readonly fieldErrors: FieldErrors;

  constructor(status: number, type: ApiError['type'], message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.fieldErrors = fieldErrors;
  }

  get isValidation(): boolean {
    return this.status === 422;
  }
}

function isEnvelope(value: unknown): value is ErrorEnvelope {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const err = (value as { error: unknown }).error;
  return typeof err === 'object' && err !== null && 'type' in err && 'message' in err;
}

export async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // not json
  }
  if (isEnvelope(body)) {
    return new ApiError(response.status, body.error.type, body.error.message, body.error.payload ?? {});
  }
  return new ApiError(response.status, 'UnknownError', response.statusText || `HTTP ${response.status}`);
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
