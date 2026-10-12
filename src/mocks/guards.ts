import { HttpResponse } from 'msw';
import type { ErrorType, FieldErrors } from '@/api/api.types';
import { isSessionActive } from './session';

export const CSRF_TOKEN = 'mock-csrf-token-5f2b9c1e';

const MESSAGES: Record<ErrorType, string> = {
  BadRequestException: 'Bad request.',
  AuthenticationException: 'Unauthenticated.',
  NotFoundException: 'Not found.',
  TokenMismatchException: 'CSRF token mismatch.',
  ValidationException: 'The given data was invalid.',
};

export function errorResponse(status: number, type: ErrorType, payload?: FieldErrors) {
  return HttpResponse.json(
    { error: { type, message: MESSAGES[type], ...(payload ? { payload } : {}) } },
    { status },
  );
}

export const badRequest = () => errorResponse(400, 'BadRequestException');
export const unauthorized = () => errorResponse(401, 'AuthenticationException');
export const notFound = () => errorResponse(404, 'NotFoundException');
export const tokenMismatch = () => errorResponse(419, 'TokenMismatchException');
export const validation = (payload: FieldErrors) => errorResponse(422, 'ValidationException', payload);

export function checkCsrf(request: Request) {
  return request.headers.get('X-CSRF-TOKEN') === CSRF_TOKEN ? null : tokenMismatch();
}

export function checkSession() {
  return isSessionActive() ? null : unauthorized();
}
