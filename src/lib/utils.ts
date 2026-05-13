import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { ApiErrorResponse, PaginationMeta } from '@/types';

// ═══════════════════════════════════════════════════════════
// Canvas Verdict — Utility Functions
// ═══════════════════════════════════════════════════════════

/**
 * 성공 응답 래퍼
 */
export function successResponse<T>(data: T, meta?: PaginationMeta, status = 200) {
  return NextResponse.json(
    { success: true as const, data, ...(meta ? { meta } : {}) },
    { status }
  );
}

/**
 * 에러 응답 래퍼
 */
export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
) {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
  return NextResponse.json(body, { status });
}

/**
 * Zod 유효성 검증 에러 → 400 응답
 */
export function validationError(error: ZodError) {
  return errorResponse(
    'VALIDATION_ERROR',
    'Request validation failed',
    400,
    error.flatten().fieldErrors
  );
}

/**
 * 페이지네이션 메타 계산
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  totalCount: number
): PaginationMeta {
  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * URL SearchParams → plain object 변환
 */
export function parseSearchParams(url: string): Record<string, string> {
  const { searchParams } = new URL(url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
