export type ErrorType =
  | 'BadRequestException'
  | 'AuthenticationException'
  | 'NotFoundException'
  | 'TokenMismatchException'
  | 'ValidationException';

export type FieldErrors = Record<string, string[]>;

export interface ErrorEnvelope {
  error: { type: ErrorType; message: string; payload?: FieldErrors };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
